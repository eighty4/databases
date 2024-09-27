import {exec as execCallback} from 'node:child_process'
import {describe, expect, it} from 'vitest'
import {promisify} from 'node:util'
import {ListDatabasesResult} from '../src/listDatabases.js'

const exec = promisify(execCallback)

describe('listDatabases', () => {
    it('discovers postgres container', async () => {
        const {stdout} = await exec('vagrant ssh list_postgres -c "cd databases; sudo pnpm --silent dev ls"', {cwd: 'test/vms'})
        const ls = JSON.parse(stdout) as ListDatabasesResult
        expect(ls.docker.containers).toHaveLength(1)
        expect(ls.docker.containers[0].containerName).toBe('postgres')
        expect(ls.docker.containers[0].database).toBe('postgres')
        expect(ls.docker.containers[0].image.digest.startsWith('postgres@sha256:')).toBe(true)
        expect(ls.docker.containers[0].image.id.startsWith('sha256:')).toBe(true)
        expect(ls.docker.containers[0].image.name).toBe('postgres')
        expect(ls.docker.containers[0].image.tag).toBe('latest')
        expect(ls.docker.containers[0].port).toBe(5432)
        expect(ls.docker.containers[0].running).toBe(true)
    })
})
