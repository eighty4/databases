export type Database =
    'cassandra'
    | 'cockroach'
    | 'elasticsearch'
    | 'mongo'
    | 'mssql'
    | 'mysql'
    | 'postgres'
    | 'scylla'

export const supportedDatabases: Array<Database> = [
    'cassandra',
    'cockroach',
    'elasticsearch',
    'mongo',
    'mssql',
    'mysql',
    'postgres',
    'scylla',
]
