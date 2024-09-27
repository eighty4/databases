import {defineConfig} from 'vitest/config'

const MINUTE = 1000 * 60

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        testTimeout: 7 * MINUTE,
    },
})
