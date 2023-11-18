import type Database from './Database.js'

export default interface PingResult {
    engine: Database
    errorMessage?: string
    verified?: {
        database: boolean
        port: boolean
        username: boolean
    }
}
