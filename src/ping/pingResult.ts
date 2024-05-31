import {type Database} from '../database.js'

export interface PingResult {
    engine: Database
    errorMessage?: string
    verified?: {
        database: boolean
        port: boolean
        username: boolean
    }
}
