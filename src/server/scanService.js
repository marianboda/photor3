import {
    getUnscannedDir,
    save,
    updateDirScanTime,
    getScanningPaths,
    saveScanningPath,
} from './dbService.js';
import { scanDir, getFileObject } from './utils.js';

export const runScanCycle = async () => {
    const dirToScan = await getUnscannedDir();
    if (!dirToScan) {
        return null;
    }

    const files = await scanDir(dirToScan.path);
    await save(files);
    await updateDirScanTime(dirToScan.path);
    return files;
};

export const initScan = async () => {
    const scanningPaths = await getScanningPaths();

    for await (const path of scanningPaths) {
        const dirObject = await getFileObject(path.path);
        await save(dirObject);
    }
};

export const addScanningPath = saveScanningPath;
