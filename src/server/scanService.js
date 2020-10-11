import util from 'util'
import child_process from 'child_process'
import {
    getUnscannedDir,
    save,
    updateDirScanTime,
    getScanningPaths as getDbScanningPaths,
    saveScanningPath,
    getDisks,
} from './dbService.js'
import { getDiskList, isWindows, hasAccess, toSystemPath } from './platformUtils.js'
import { scanDir, getFileObject, lowercaseFirstLetter } from './utils.js'

const exec = util.promisify(child_process.exec)

export const runScanCycle = async () => {
    const dirToScan = await getUnscannedDir()
    if (!dirToScan) {
        return null
    }

    const files = await scanDir(dirToScan.path)
    await save(files)
    await updateDirScanTime(dirToScan.disk, dirToScan.path)
    return files
}

export const initScan = async () => {
    const scanningPaths = await getScanningPaths()
    const disks = await getDisks()

    for await (const path of scanningPaths) {
        const diskName = disks.find(d => d.id == path.disk)?.name
        const systemPath = await toSystemPath(diskName, path.path)
        console.log('scanning path', systemPath)
        continue
        const dirObject = await getFileObject(path.path)
        await save(dirObject)
    }
}

export const addScanningPath = saveScanningPath

export const addAvailabilityToPaths = async paths => {
    const disks = await getDisks()
    const promises = paths.map(async path => {
        const diskName = disks.find(d => d.id == path.disk)?.name
        const systemPath = await toSystemPath(diskName, path.path)
        const available = await hasAccess(systemPath)
        return { ...path, available }
    })

    return await Promise.all(promises)
}

export const getScanningPaths = async () => {
    const rawScanningPaths = await getDbScanningPaths()
    return addAvailabilityToPaths(rawScanningPaths)
}

export const getMountedDisks = async () => {
    return getDiskList()
}