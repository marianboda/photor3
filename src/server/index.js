import express from 'express'
import sqlite from 'sqlite3'

import { getReaddirRecursiveIterable } from './utils.js'
import { save } from './dbService.js'

const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.urlencoded())

const db = new sqlite.Database('../../data/db.sqlite')

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
    const { dir } = req.body
    const result = await main(dir)
    res.send(result)
})
