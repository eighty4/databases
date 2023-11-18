import {pingPostgres} from './ping/postgres.js'
import PingResult from './PingResult.js'

export interface ListDatabasesResult {
    pingResults: Array<PingResult>
}

export async function listDatabases(): Promise<ListDatabasesResult> {
    return {
        pingResults: await Promise.all([
            pingPostgres({username: 'postgres', port: 5432}),
        ]),
    }
}
