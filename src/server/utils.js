import fs from 'fs'
import Path from 'path'

import RxJs from 'rxjs'
import RxOps from 'rxjs/operators/index.js'
import dayjs from 'dayjs'
import R from 'ramda'
import crypto from 'crypto'
import { promisify } from 'util'

import { pathToUnipath, getDirAndName, toDiskAndPath } from './platformUtils.js'

const { bindNodeCallback, of, merge, from } = RxJs
const { flatMap, map, filter, /* take, */ tap, catchError } = RxOps
const { isEmpty } = R
const getStat = promisify(fs.lstat)

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'

const filesInDir = bindNodeCallback(fs.readdir)
const statFile = bindNodeCallback(fs.stat)

export const hashFile = path => {
    return new Promise(resolve => {
        console.log('path', path)
        const fd = fs.createReadStream(path)
        const hash = crypto.createHash('md5')
        hash.setEncoding('hex')

        fd.on('end', () => {
            hash.end()
            const hashString = hash.read()
            console.log(hashString)
            resolve(hashString)
        })

        fd.pipe(hash)
    })
}

const filenameFilter = file => !['.', '..'].includes(file)

const transformFile = dir => file =>
    statFile(Path.join(dir, file))
        // .pipe(tap(sf => console.log(sf)))
        .pipe(filter(sf => sf.isDir || sf.isFile))
        .pipe(
            map(sf => ({
                name: file,
                dir: Path.resolve(dir),
                path: Path.join(Path.resolve(dir), file),
                isDir: sf.isDirectory(),
                size: !sf.isDirectory() ? sf.size : 0,
                mTime: dayjs(sf.mtime).format(DATE_FORMAT),
                birthTime: dayjs(sf.birthtime).format(DATE_FORMAT),
                scanTime: dayjs().format(DATE_FORMAT),
            })),
        )

const addHashToObject = obj => hash => ({
    ...obj,
    hash,
})

const addHash = file =>
    file.isDir
        ? from(new Promise(resolve => resolve(file)))
        : from(hashFile(file.path).then(addHashToObject(file)))

export const listFiles = dir => {
    const file$ = filesInDir(dir).pipe(
        flatMap(file => file),
        tap(file => console.log('first tap:', file)),
        filter(filenameFilter),
        flatMap(transformFile(dir)),
        catchError(() => of({})),
        filter(i => !isEmpty(i)),
        flatMap(f => {
            if (f.isDir) {
                return merge(of(f), listFiles(Path.join(dir, f.name)))
            }
            return of(f)
        }),
        tap(i => console.log('should be hashing', i.path)),
        flatMap(addHash),
        tap(i => console.log('after map', i)),
    )
    return file$
}

// Trial with async iterable

const asyncDone = () =>
    new Promise(resolve => {
        resolve({ done: true })
    })

const asyncValue = value =>
    new Promise(resolve => {
        resolve({ done: false, value })
    })

export const getReaddirIterable = path => {
    let buffer
    // const counter = 0;

    const iterable = {
        [Symbol.asyncIterator]() {
            return this
        },
        next() {
            // counter++
            // if (counter > 100) {
            //     return asyncDone()
            // }
            if (typeof buffer === 'undefined') {
                return new Promise(resolve => {
                    fs.readdir(path, (e, files) => {
                        if (e) {
                            console.log(e)
                            return resolve({ done: true })
                        }
                        if (files.length === 0) {
                            return resolve({ done: true })
                        }
                        buffer = files
                        const value = buffer.shift()
                        return resolve({ done: false, value })
                    })
                })
            }

            if (buffer.length > 0) {
                const value = buffer.shift()
                return asyncValue(value)
            }

            return asyncDone()
        },
    }
    return iterable
}

export const getFileObject = async (rawDir, file = '') => {
    const dir = Path.resolve(rawDir)
    console.log('getFileObj', dir, file)
    try {
        const filePath = Path.join(dir, file)
        const stat = await getStat(filePath)
        const isDir = stat.isDirectory()
        const [parentDir, fileName] = getDirAndName(dir)
        const extension = file.includes('.') ? R.last(file.split('.')) : ''
        const extensionObject = stat.isDirectory() ? {} : { extension }
        console.log('mtime', stat.mtime)
        console.log('unix()', dayjs(stat.mtime).unix())
        const [disk, diskPath] = toDiskAndPath(isDir ? parentDir : dir)

        return {
            name: file || fileName,
            dir: diskPath,
            ...extensionObject,
            // path: await pathToUnipath('', filePath),
            isDir,
            size: !stat.isDirectory() ? stat.size : 0,
            mTime: dayjs(stat.mtime).unix(),
            birthTime: dayjs(stat.birthtime).unix(),
            ...(stat.isDirectory() ? {} : { scanTime: dayjs().format(DATE_FORMAT) }),
        }
    } catch (e) {
        console.log('dir unavailable', dir)
        console.log('e', e)
        return null
    }
}

export const getReaddirRecursiveIterable = path => {
    const iter = getReaddirIterable(path)
    let innerIter = null
    const counter = 0

    const iterable = {
        [Symbol.asyncIterator]() {
            return this
        },
        async next() {
            // counter++
            if (counter > 100) {
                return { done: true }
            }

            if (innerIter) {
                const innerValue = await innerIter.next()
                if (!innerValue.done) {
                    return innerValue
                }
            }

            const { value, done } = await iter.next()
            if (done) return { done: true }

            const filePath = Path.join(path, value)
            const file = await getFileObject(pathToUnipath(path), value)

            if (file.isDir) {
                innerIter = getReaddirRecursiveIterable(filePath)
            }

            return { value: file, done }
        },
    }
    return iterable
}

export const scanDir = async path => {
    console.log('scanning: ', path)
    const thisFile = await getFileObject(path)
    console.log('this file: ', thisFile)
    const iter = getReaddirIterable(path)
    let result = []

    for await (const i of iter) {
        const file = await getFileObject(path, i)
        result = [...result, file]
    }

    return result
}

export const lowercaseFirstLetter = str => {
    if (str === '' || typeof str === 'undefined') return str
    console.log(str)
    return str.charAt(0).toLowerCase() + str.slice(1)
}
