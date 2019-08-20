import express from 'express'
import sqlite from 'sqlite3'

import { getReaddirRecursiveIterable } from './utils.js'
import { save, getFiles } from './dbService.js'

const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.json())

const db = new sqlite.Database('./data/db.sqlite')

async function dbGet() {
    return new Promise((resolve, reject) => {
        db.all(getFiles(), (err, data) => {
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
    const data = await dbGet()
    res.send(data)
})
