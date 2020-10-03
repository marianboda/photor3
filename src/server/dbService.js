import sqlite from 'sqlite3'
import R from 'ramda'
import dayjs from 'dayjs'
import { isWindows, isMac, isUnix, pathToUnipath } from './platformUtils.js'
import { DATE_FORMAT } from './utils.js'

const { without } = R

const db = new sqlite.Database('./data/db.sqlite')

export async function dbGet(query) {
    console.log('dbGet query', query)
    return new Promise((resolve, reject) => {
        db.all(query, (err, data) => {
            if (err) {
                console.log('db.all promise rejected')
            } else {
                console.log('db.all success')
            }
            if (err) return reject(err)
            return resolve(data)
        })
    })
}

async function dbSave(query, params) {
    console.log('dbSave query', query)
    return new Promise((resolve, reject) => {
        db.run(query, params, (err, data) => {
            if (err) {
                console.log('db.run promise rejected', err)
            } else {
                console.log('db.run success', data)
            }
            if (err) return reject(err)
            return resolve(data)
        })
    })
}

async function dbExec(query) {
    if (!query) return null
    console.log('dbExec query', query)
    return new Promise((resolve, reject) => {
        db.exec(query, (err, data) => {
            if (err) {
                console.log('db.exec promise rejected', err)
            } else {
                console.log('db.exec success', data)
            }
            if (err) return reject(err)
            return resolve(data)
        })
    })
}

export const getScanningPaths = () => dbGet('SELECT * FROM scanning_path')
export const getUnscannedDir = async () => {
    const q = 'SELECT * FROM dir WHERE scanTime is NULL limit 1'
    const result = await dbGet(q)
    return result[0] || null
}

const getSaveDirQuery = dir => {
    console.log('saving dir', dir)
    const keys = without(['isDir', 'size'], Object.keys(dir))
    const vals = keys.map(key => `"${dir[key]}"`)
    return `INSERT OR IGNORE INTO dir (${keys.join(',')}) VALUES (${vals.join(',')})`
}

const getSaveFileQuery = file => {
    const keys = without(['isDir'], Object.keys(file))
    const vals = keys.map(key => `"${file[key]}"`)
    return `INSERT OR IGNORE INTO file (${keys.join(',')}) VALUES (${vals.join(',')})`
}

const getSaveQuery = files => {
    const getSaveOneQuery = f => {
        if (!f) return null
        return f.isDir ? getSaveDirQuery(f) : getSaveFileQuery(f)
    }
    if (Array.isArray(files)) {
        return files.map(getSaveOneQuery).join(';\n')
    }
    return getSaveOneQuery(files)
}

export const save = async files => {
    console.log('------- SAVE QUERY -------------------')
    console.log(getSaveQuery(files))
    console.log('------- ---------- -------------------')
    const result = await dbExec(getSaveQuery(files))
    console.log(' - ', result)
    return result
}

const getDirScanTimeUpdateQuery = path => {
    return `UPDATE dir SET scanTime='${dayjs().format(DATE_FORMAT)}' WHERE path='${path}'`
}

export const updateDirScanTime = async path => {
    return dbSave(getDirScanTimeUpdateQuery(path))
}

export const saveScanningPath = async (disk, path) => {
    console.log('isWin', isWindows())
    if (isWindows()) {
        const volumeLetter = path.split(':')[0]

        console.log('volumeLetter', volumeLetter)

        pathToUnipath(disk, path)
    }
    if (isMac() || isUnix()) {
        console.log(`have to save disk: ${disk}, path: ${path}`)
        const unipath = await pathToUnipath(disk, path)
        return dbSave(`INSERT OR IGNORE INTO scanning_path (path) VALUES (?)`, [unipath])
    }
    // return dbSave(`INSERT OR IGNORE INTO scanning_path (path) VALUES (?)`, [path])
    // return dbSave(`INSERT OR IGNORE INTO disk (path) VALUES (?)`, [path])
}

const getFilesQuery = () => 'SELECT * FROM file LIMIT 100'

export const getFiles = () => dbGet(getFilesQuery())

const getDirsQuery = (dir = '') => `SELECT * FROM dir WHERE dir="${dir}";`
// `SELECT dir as path, MIN(name) as firstFile, MAX(name) as lastFile, COUNT(id) as filesCount FROM file WHERE dir="${dir}" GROUP BY dir;`

const sanitizePath = path => {
    if (path.match(/[A-Z]:/)) {
        return `${path}\\`
    }
    return path
}

export const getDirs = async root => {
    console.log('root', root)
    if (!root) {
        const scanningPaths = await getScanningPaths()
        return scanningPaths.map(i => ({
            path: i.path,
            firstFile: '',
            lastFile: '',
            filesCount: 0,
        }))
    }
    return dbGet(getDirsQuery(sanitizePath(root)))
}

export const getDeepestUnprocessedDir = async () => {
    return dbGet(
        'select * FROM dir WHERE deepFilesCount IS NULL ORDER BY length(path) DESC LIMIT 1',
    )
}
