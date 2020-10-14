import express from 'express'
import ws from 'ws'

import {
    runScanCycle,
    initScan,
    addScanningPath,
    getMountedDisks,
    getScanningPaths,
} from './scanService.js'
import { getFiles, getDirs, dbGet, getDisks } from './dbService.js'
import { getFileStats } from './dbServiceLegacy.js'

const app = express()
const port = process.env.PORT || 5000

const wsServer = new ws.Server({ noServer: true, clientTracking: true })
wsServer.broadcast = message => {
    wsServer.clients.forEach(client => client.send(message))
}

wsServer.on('connection', socket => {
    socket.on('message', console.log.bind(console))
})

let state = {
    isScanning: false,
}

const setState = change => {
    state = { ...state, ...change }
}

const server = app.listen(port, () => console.log(`Listening on port ${port}`))

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request)
    })
})

wsServer.on('connection', wsConnection => {
    wsConnection.send('Greetings from Server :D')
})

app.use(express.json())

app.post('/scan-start', async (req, res) => {
    console.log('starting scan')
    await initScan()
    setState({ isScanning: true })
    wsServer.broadcast(JSON.stringify({type: 'SCAN_STARTED'}))
    res.send({})
    while (state.isScanning) {
        const files = await runScanCycle()
        if (files === null) {
            setState({ isScanning: false })
        }
    }
    wsServer.broadcast(JSON.stringify({type: 'SCAN_STOP'}))
})

app.post('/scan-stop', async (req, res) => {
    setState({ isScanning: false })
    res.send({})
})

app.post('/scanning-path', async (req, res) => {
    const { disk, path } = req.body
    res.send(addScanningPath(disk, path))
})

app.get('/files', async (req, res) => {
    const data = await getFiles()
    res.send(data)
})

app.get('/dirs', async (req, res) => {
    const dir = req.param('dir')
    const data = await getDirs(dir)
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

app.get('/disks', async (req, res) => {
    const data = await getDisks()
    res.send(data)
})

app.get('/mounted-disks', async (req, res) => {
    const data = await getMountedDisks()
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
