import {listDatabaseContainers, listDatabaseImages, DatabaseImages} from '../../src/docker'

listDatabaseImages().then(listContainers).catch(console.error)

function listContainers(images: Array<DatabaseImages>) {
    console.log('images:')
    console.log(images)
    console.log('containers:')
    listDatabaseContainers(images).then(console.log).catch(console.error)
}
