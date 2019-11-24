import express from 'express';
import sqlite from 'sqlite3';

import { getReaddirRecursiveIterable, hashFile /* , scanDir, getFileObject */ } from './utils.js';
import {
    save,
    getFiles,
    getDeepestUnprocessedDir,
    getFilesInDir,
    saveScanningPath,
    getScanningPaths,
    getDirsInDir,
    updateDir,
    getUnhashedFile,
    updateFileHash,
    getFileStats
} from './dbService.js';

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(express.json());

const db = new sqlite.Database('./data/db.sqlite');

async function dbGet(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, data) => {
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

const scan = async path => {
    const iter = await getReaddirRecursiveIterable(path);
    let count = 0;
    let result = [];
    for await (const i of iter) {
        console.log(i);
        db.run(save(i));
        result = [...result, save(i)];
        count += 1;
        console.log(count);
    }

    return result;
};

app.post('/scan', async (req, res) => {
    const scanningPaths = await dbGet(getScanningPaths());
    const { path } = scanningPaths[0];
    // const file = await getFileObject(path)
    const result = await scan(path);
    // const result = await scanDir(path)
    // console.log(result)
    // console.log(save(result))
    // db.exec(save(result))
    res.send(result);
});

app.post('/scanning-path', async (req, res) => {
    const { path } = req.body;
    const result = db.run(...saveScanningPath(path));
    res.send(result);
});

app.get('/files', async (req, res) => {
    const data = await dbGet(getFiles());
    res.send(data);
});

app.get('/stats', async (req, res) => {
    const data = await dbGet(getFileStats());
    res.send(data[0]);
});

app.post('/processDeepestDir', async (req, res) => {
    const [dir] = await dbGet(getDeepestUnprocessedDir());
    const files = await dbGet(getFilesInDir(dir.path));
    const dirs = await dbGet(getDirsInDir(dir.path));
    // const size = files.reduce((acc, el) => acc + el.size, 0) + dirs.reduce((acc, el) => )
    const innerOnlyCount = dirs.reduce((acc, el) => acc + el.deepFilesCount, 0);
    const filesCount = files.length;
    const deepFilesCount = filesCount + innerOnlyCount;

    const updateDirQuery = updateDir(dir.id, {
        filesCount,
        deepFilesCount
    });

    const getResult = dbGet(updateDirQuery);

    res.send({ deepFilesCount, filesCount, getResult });
});

app.post('/hashFile', async (req, res) => {
    const [file] = await dbGet(getUnhashedFile());
    const hash = await hashFile(file.path);
    await dbGet(updateFileHash(file.id, hash));
    res.send({ ...file, hash });
});
