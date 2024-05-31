import {listDatabases} from './listDatabases.js'

export default async () => {
    const result = await listDatabases()
    console.log(JSON.stringify(result, null, 2))
}
