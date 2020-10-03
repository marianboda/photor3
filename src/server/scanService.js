import util from 'util'
import child_process from 'child_process'
import {
    getUnscannedDir,
    save,
    updateDirScanTime,
    getScanningPaths,
    saveScanningPath,
} from './dbService.js'
import { getDiskList, isWindows, unipathToPath } from './platformUtils.js'
import { scanDir, getFileObject, lowercaseFirstLetter } from './utils.js'

const exec = util.promisify(child_process.exec)

export const runScanCycle = async () => {
    const dirToScan = await getUnscannedDir()
    if (!dirToScan) {
        return null
    }

    const files = await scanDir(dirToScan.path)
    await save(files)
    await updateDirScanTime(dirToScan.path)
    return files
}

export const initScan = async () => {
    const scanningPaths = await getScanningPaths()

    for await (const path of scanningPaths) {
        const dirObject = await getFileObject(unipathToPath(path.path))
        await save(dirObject)
    }
}

export const addScanningPath = saveScanningPath

export const getDisks = async () => {
    return getDiskList()
}