import Docker from 'dockerode'
import {type Database, supportedDatabases} from './database.js'

const databaseImageNames: Record<string, Database> = {
    'cassandra': 'cassandra',
    'cockroachdb/cockroach': 'cockroach',
    'elasticsearch': 'elasticsearch',
    'mcr.microsoft.com/mssql/server': 'mssql',
    'mongo': 'mongo',
    'mysql': 'mysql',
    'postgres': 'postgres',
    'scylladb/scylla': 'scylla',
}

const databaseProtocolPorts: Record<Database, number> = {
    cassandra: 9042,
    cockroach: 26257,
    elasticsearch: 9200,
    mongo: 27017,
    mssql: 1433,
    mysql: 3306,
    postgres: 5432,
    scylla: 9042,
}

export interface DatabaseContainer {
    containerName: string
    database: Database
    image: ImageDetail
    port?: number
    running: boolean
}

export interface DatabaseImages {
    database: Database
    images: Array<ImageDetail>
}

export interface ImageDetail {
    digest: string
    id: string
    name: string
    tag: string
}

export interface ContainerDetail {
    id: string
    name: string
    image: ImageDetail
}

export interface ImageRequest {
    database: Database
    tag?: string
}

export async function listDatabaseImages(): Promise<Array<DatabaseImages>> {
    const docker = new Docker()
    const images = await docker.listImages({digests: true})
    const collect: Record<Database, Array<ImageDetail>> = {
        cassandra: [],
        cockroach: [],
        elasticsearch: [],
        mongo: [],
        mssql: [],
        mysql: [],
        postgres: [],
        scylla: [],
    }
    for (const image of images) {
        if (image.RepoTags && image.RepoTags.length && image.RepoDigests && image.RepoDigests.length) {
            const id = image.Id
            const [name, tag] = image.RepoTags[0].split(':')
            const digest = image.RepoDigests[0]
            const database = databaseImageNames[name]
            if (database) {
                collect[database].push({digest, id, name, tag})
            }
        }
    }
    const result: Array<DatabaseImages> = []
    for (const database of supportedDatabases) {
        const images = collect[database]
        if (images.length) {
            result.push({
                database,
                images,
            })
        }
    }
    return result
}

export async function listDatabaseContainers(images: Array<DatabaseImages>): Promise<Array<DatabaseContainer>> {
    const imagesById: Record<string, {
        database: Database,
        image: ImageDetail
    }> = {}
    for (const database of images) {
        for (const image of database.images) {
            imagesById[image.id] = {database: database.database, image}
        }
    }
    const docker = new Docker()
    const containers = await docker.listContainers({all: true})
    const result: Array<DatabaseContainer> = []
    for (const container of containers) {
        const imageLookup = imagesById[container.ImageID]
        if (imageLookup) {
            const {database, image} = imageLookup
            const protocolPort = databaseProtocolPorts[database]
            const dockerPort = container.Ports.find((port) => {
                return port.PrivatePort === protocolPort
            })
            const containerName = container.Names[0].startsWith('/') ? container.Names[0].substring(1) : container.Names[0]
            const port = dockerPort?.PublicPort
            const running = container.State === 'running'
            result.push({containerName, database, image, port, running})
        }
    }
    return result
}

export async function pullDatabaseImage({database, tag = 'latest'}: ImageRequest): Promise<ImageDetail> {
    const name = Object.keys(databaseImageNames)
        .find(imageName => databaseImageNames[imageName] === database)
    if (!name) {
        throw new Error(`image name for database ${database} not found`)
    }

    const docker = new Docker()
    await docker.pull(`${name}:${tag}`)

    const inefficientLookup = await listDatabaseImages()
    const found = inefficientLookup
        .find((image) => image.database == database)?.images
        .find((image) => image.name === name && image.tag === tag)

    if (found) {
        return found
    } else {
        console.warn(`WARN ${name}:${tag} not found via listDatabaseImages`)
        return {name, tag} as ImageDetail
    }
}

export async function startDatabaseContainer(image: ImageDetail): Promise<ContainerDetail> {
    if (!Object.keys(databaseImageNames).includes(image.name)) {
        throw new Error(`${image.name} is not supported`)
    }

    const docker = new Docker()
    const container = await docker.createContainer({
        Image: `${image.name}:${image.tag || 'latest'}`,
    })
    await container.start()

    return {
        id: container.id,
        name: (await container.inspect()).Name,
        image,
    }
}
