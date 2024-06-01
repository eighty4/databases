import {startDatabase} from '../startDatabase.js'
import {Database} from '../database.js'

interface DatabaseUpOptions {
    database: Database
}

export default async ({database}: DatabaseUpOptions) => {
    const result = await startDatabase({database})
    console.log(JSON.stringify(result, null, 2))
}
