import {program} from 'commander'
import ls from './ls.js'

program
    .name('@eighty4/databases')
    .description('CLI for database-focused developer workflows')
    .version('0.0.4')

program
    .command('ls')
    .description('List local databases')
    .action((args, cmd) => ls().then().catch(catchError))

program.parse()

function catchError(e: any): never {
    console.error('error:', e.message)
    process.exit(1)
}
