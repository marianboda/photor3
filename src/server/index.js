import express from 'express';

import { save, getScanningPaths, getUnscannedDir, updateDirScanTime } from './dbService.js';
import { scanDir, getFileObject } from './utils.js';

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(express.json());

const runScanCycle = async () => {
    const dirToScan = await getUnscannedDir();
    if (!dirToScan) {
        return null;
    }

    const files = await scanDir(dirToScan.path);
    await save(files);
    await updateDirScanTime(dirToScan.path);
    return files;
};

app.post('/scan', async (req, res) => {
    const scanningPaths = await getScanningPaths();

    for await (const path of scanningPaths) {
        const dirObject = await getFileObject(path.path);
        await save(dirObject);
    }

    const files = await runScanCycle();
    return res.send(files);
});

// app.post('/scanning-path', async (req, res) => {
//     const { path } = req.body;
//     const result = db.run(...saveScanningPath(path));
//     res.send(result);
// });

// app.get('/files', async (req, res) => {
//     const data = await dbGet(getFiles());
//     res.send(data);
// });

// app.get('/stats', async (req, res) => {
//     const data = await dbGet(getFileStats());
//     res.send(data[0]);
// });

// app.post('/processDeepestDir', async (req, res) => {
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
