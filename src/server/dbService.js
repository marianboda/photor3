import R from 'ramda'

const { without } = R

export const saveDir = (dir) => {
    const keys = without(['isDir', 'dir', 'size'], Object.keys(dir))
    const vals = keys.map(key => `"${dir[key]}"`)
    return `INSERT OR IGNORE INTO dir (${keys.join(',')}) VALUES (${vals.join(',')})`
}

export const saveFile = (file) => {
    const keys = without(['isDir'], Object.keys(file))
    const vals = keys.map(key => `"${file[key]}"`)
    return `INSERT OR IGNORE INTO file (${keys.join(',')}) VALUES (${vals.join(',')})`
}

export const save = file => file.isDir ? saveDir(file) : saveFile(file)

export const getFiles = () => 'SELECT * FROM file LIMIT 100'
