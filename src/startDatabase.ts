import {Database} from './database.js'
import {ContainerDetail, pullDatabaseImage, startDatabaseContainer} from './docker.js'

interface DatabaseContainerOptions {
    database: Database,
    tag?: string,
}

export async function startDatabase({database, tag}: DatabaseContainerOptions): Promise<ContainerDetail> {
    const image = await pullDatabaseImage({database, tag})
    return await startDatabaseContainer(image)
}
