import express from 'express'

import { runScanCycle, initScan, addScanningPath } from './scanService.js'
import { getFiles, getDirs, getScanningPaths } from './dbService.js'

const app = express()
const port = process.env.PORT || 5000

let state = {
    isScanning: false,
}

const setState = change => {
    state = { ...state, ...change }
}

app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.json())

app.post('/scan-start', async (req, res) => {
    console.log('starting scan')
    await initScan()
    setState({ isScanning: true })
    res.send({})
    while (state.isScanning) {
        const files = await runScanCycle()
        if (files === null) {
            setState({ isScanning: false })
        }
    }
})

app.post('/scan-stop', async (req, res) => {
    setState({ isScanning: false })
    res.send({})
})

app.post('/scanning-path', async (req, res) => {
    const { path } = req.body
    res.send(addScanningPath(path))
})

app.get('/files', async (req, res) => {
    const data = await getFiles()
    res.send(data)
})

app.get('/dirs', async (req, res) => {
    const data = await getDirs()
    res.send(data)
})

app.get('/stats', async (req, res) => {
    const data = await dbGet(getFileStats())
    res.send(data[0])
})

app.get('/scanning-paths', async (req, res) => {
    const data = await getScanningPaths()
    res.send(data)
})

// app.post('/process-deepest-dir', async (req, res) => {
//     const [dir] = await dbGet(getDeepestUnprocessedDir());
//     const files = await dbGet(getFilesInDir(dir.path));
//     const dirs = await dbGet(getDirsInDir(dir.path));
//     // const size = files.reduce((acc, el) => acc + el.size, 0) + dirs.reduce((acc, el) => )
//     const innerOnlyCount = dirs.reduce((acc, el) => acc + el.deepFilesCount, 0);
//     const filesCount = files.length;
//     const deepFilesCount = filesCount + innerOnlyCount;

//     const updateDirQuery = updateDir(dir.id, {
//         filesCount,
//         deepFilesCount
//     });

//     const getResult = dbGet(updateDirQuery);

//     res.send({ deepFilesCount, filesCount, getResult });
// });

// app.post('/hashFile', async (req, res) => {
//     const [file] = await dbGet(getUnhashedFile());
//     const hash = await hashFile(file.path);
//     await dbGet(updateFileHash(file.id, hash));
//     res.send({ ...file, hash });
// });
