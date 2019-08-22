import express from 'express'
import sqlite from 'sqlite3'

import { getReaddirRecursiveIterable, hashFile } from './utils.js'
import { save, getFiles, getDeepestUnprocessedDir, getFilesInDir,
    getDirsInDir, updateDir, getUnhashedFile, updateFileHash } from './dbService.js'

const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.json())

const db = new sqlite.Database('./data/db.sqlite')

async function dbGet(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, data) => {
            if (err) return reject(err)
            return resolve(data)
        })
    })
}

const main = async (path) => {
    const iter = await getReaddirRecursiveIterable(path)
    let count = 0
    let result = []
    for await (let i of iter) {
        console.log(i)
        db.run(save(i))
        result = [...result, save(i)]
        count++
        console.log(count)
    }

    return result
}

app.post('/scan', async (req, res) => {
    const { path } = req.body
    console.log(path)
    const result = await main(path)
    res.send(result)
})

app.get('/files', async (req, res) => {
    const data = await dbGet(getFiles())
    res.send(data)
})

app.post('/processDeepestDir', async (req, res) => {
    const [dir] = await dbGet(getDeepestUnprocessedDir())
    const files = await dbGet(getFilesInDir(dir.path))
    const dirs = await dbGet(getDirsInDir(dir.path))
    // const size = files.reduce((acc, el) => acc + el.size, 0) + dirs.reduce((acc, el) => )
    const innerOnlyCount = dirs.reduce((acc, el) => acc + el.deepFilesCount, 0)
    const filesCount = files.length
    const deepFilesCount = filesCount + innerOnlyCount

    const updateDirQuery = updateDir(dir.id, {
        filesCount,
        deepFilesCount,
    })

    const getResult = dbGet(updateDirQuery)

    res.send({ deepFilesCount, filesCount, getResult })
})

app.post('/hashFile', async (req, res) => {
    const [file] = await dbGet(getUnhashedFile())
    const hash = await hashFile(file.path)
    await dbGet(updateFileHash(file.id, hash))
    res.send({ ...file, hash })
})
