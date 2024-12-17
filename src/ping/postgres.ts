import {Socket} from 'net'
import {type PingResult} from './pingResult.js'

export interface PostgresProps {
    port: number
    username: string
}

export function pingPostgres(props: PostgresProps): Promise<PingResult> {
    return new Promise((res, rej) => {
        if (!props || !props.port || !props.username) {
            rej('PostgresProps required')
            return
        }
        let result: PingResult
        const socket = new Socket({})
        const closeSocketAndPromise = () => socket.end(() => {
            if (result) {
                res(result)
            } else {
                rej(new Error('unhandled scenario'))
            }
        })
        socket.on('error', (e: any) => {
            result = {
                engine: 'postgres',
                errorMessage: e.message,
            }
            closeSocketAndPromise()
        })
        socket.connect(5432, () => {
            const startupMessageUint8 = [
                0, 0, 0, 0, // size
                0, 3, 0, 0, // protocol
            ]
            startupMessageUint8.push(...new Uint8Array(Buffer.from('user')), 0)
            startupMessageUint8.push(...new Uint8Array(Buffer.from(props.username)), 0, 0)
            startupMessageUint8[3] = startupMessageUint8.length
            // console.log(startupMessageUint8)
            // console.log(Buffer.from(startupMessageUint8))
            socket.write(Buffer.from(startupMessageUint8))
        })
        socket.on('data', (buf: Buffer) => {
            // console.log(buf)
            // console.log(buf.toString())
            let msgType = buf.subarray(0, 1).toString()
            if (msgType === 'E') {
                let errorMessage
                for (const b of bufferDelimSplit(buf.subarray(5), 0)) {
                    if (b.subarray(0, 1).toString() === 'M') {
                        errorMessage = b.subarray(1).toString()
                        break
                    }
                }
                result = {
                    engine: 'postgres',
                    errorMessage,
                    verified: {
                        database: true,
                        port: true,
                        username: false,
                    },
                }
            } else if (msgType === 'R') {
                // todo sasl auth to verify username/password
                //  https://www.postgresql.org/docs/current/sasl-authentication.html
                //  https://www.postgresql.org/docs/current/protocol-message-formats.html
                result = {
                    engine: 'postgres',
                    verified: {
                        database: true,
                        port: true,
                        username: false,
                    },
                }
            }
            closeSocketAndPromise()
        })
    })
}

function* bufferDelimSplit(buffer: Buffer, delim: number): Generator<Buffer, any, any> {
    let start: number = 0
    while (true) {
        let next: number = buffer.indexOf(delim, start)
        let chunk: Buffer
        if (next === -1) {
            chunk = buffer.subarray(start)
            if (chunk.length) {
                yield chunk
            }
            break
        } else {
            chunk = buffer.subarray(start, next)
            if (chunk.length) {
                yield chunk
            }
        }
        start = next + 1
    }
}
