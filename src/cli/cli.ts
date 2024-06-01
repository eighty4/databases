import {program} from 'commander'
import ls from './ls.js'
import up from './up.js'
import {supportedDatabases} from '../database.js'

program
    .name('@eighty4/databases')
    .description('CLI for database-focused developer workflows')
    .version('0.0.4')

program
    .command('ls')
    .description('List local databases')
    .action(() => ls().then().catch(catchError))

program
    .command('up')
    .aliases(['start', 'launch'])
    .description('Start a database container')
    .addOption(program.createOption('--db <name>', 'database to start')
        .choices(supportedDatabases)
        .makeOptionMandatory(true))
    .action((args) => up({database: args.db}).then(handleZombieProcessResidentEvilLike).catch(catchError))

program.parse()

function catchError(e: any): never {
    console.error('error:', e.message)
    process.exit(1)
}

function handleZombieProcessResidentEvilLike(): never {
    process.exit(0)
}
