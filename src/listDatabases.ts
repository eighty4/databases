import {pingPostgres} from './ping/postgres.js'
import PingResult from './PingResult.js'
import type {DatabaseContainer, DatabaseImages} from './docker.js'
import {listDatabaseContainers, listDatabaseImages} from './docker.js'

export interface ListDatabasesResult {
    docker: {
        containers: Array<DatabaseContainer>
        images: Array<DatabaseImages>
    }
    pingResults: Array<PingResult>
}

export async function listDatabases(): Promise<ListDatabasesResult> {
    const images = await listDatabaseImages()
    const containers = await listDatabaseContainers(images)
    return {
        docker: {
            containers,
            images,
        },
        pingResults: await Promise.all([
            pingPostgres({username: 'postgres', port: 5432}),
        ]),
    }
}
