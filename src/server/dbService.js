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

export const getDeepestUnprocessedDir = () => {
    return 'select * FROM dir WHERE deepFilesCount IS NULL ORDER BY length(path) DESC LIMIT 1'
}

export const getFilesInDir = (dir) => {
    return `select * FROM file WHERE dir="${dir}"`
}

export const getDirsInDir = (dir) => {
    return `select * FROM dir WHERE SUBSTR(path, 1, ${dir.length + 1})="${dir}/"`
}

export const updateDir = (id, data) => {
    const values = Object.entries(data).reduce((acc, [key, value]) => {
        const entry = `${key} = "${value}"`
        return [...acc, entry]
    }, [])
    const valuesString = values.join(', ')

    return `UPDATE dir SET ${valuesString} WHERE id=${id}`
}

export const getUnhashedFile = () => 'SELECT * FROM file WHERE hash IS NULL LIMIT 1'

export const updateFileHash = (fileId, hash) => (
    `UPDATE file SET hash="${hash}" WHERE id=${fileId}`
)
