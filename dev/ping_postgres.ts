import {pingPostgres} from '../src/ping/postgres'

pingPostgres({port: 5432, username: 'postgres'}).then(console.log).catch(console.error)
