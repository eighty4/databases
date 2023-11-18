const pg = require('pg')

const client = new pg.Client({
    user: 'postgres',
    password: 'mysecretpassword',
})
client.connect().then(() => new Promise(() => {}).then())
