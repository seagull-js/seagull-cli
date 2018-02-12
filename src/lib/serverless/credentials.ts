import * as fs from 'fs'
import * as readline from 'readline'

import { IAWSCredentials } from './interfaces'

export function retrieveCredentials(): IAWSCredentials {
    // TODO: immplement method to check whether aws credentials are set
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    }
    const profile = process.env.AWS_PROFILE
    if (profile && profile.length > 0) {
        const lines = fileToStringArray('~/.aws/credentials')
        let index = 0
        for (const line of lines) {
            if (line && line.indexOf(`[${profile}]`) >= 0) {
                return readProfileCredentials(lines, index)
            }
            index++
        }
    }
    return {}
}

function readProfileCredentials(lines: string[], index: number): IAWSCredentials {
    const result = {
        accessKeyId: undefined,
        secretAccessKey: undefined
    }
    let i = index + 1
    while(lines && (lines.length > i)) {
        if (!lines[i]) {
            continue
        }
        if (lines[i].indexOf('[') >= 0) {
            break
        }
        readProfileLine(result, lines[i])
        i++
    }
    return result
}

function readProfileLine(result: IAWSCredentials, line: string): void {
    const id = 'aws_access_key_id = '
    const sec = 'aws_secret_access_key = '
    const iid = line.indexOf(id)
    if (iid >= 0) {
        result.accessKeyId = line.substring(iid + id.length, line.length)
    }
    const isec = line.indexOf(sec)
    if (isec >= 0) {
        result.secretAccessKey = line.substring(isec + sec.length, line.length)
    }
}

function fileToStringArray(inputFile: string): string[] {
    const lines = []
    if (fs.existsSync(inputFile)) {
        const instream = fs.createReadStream(inputFile)
        const outstream = new (require('stream'))()
        const rl = readline.createInterface(instream, outstream);
        rl.on('line', (line) => {
            lines.push(line)
        });
    }
    return lines
}