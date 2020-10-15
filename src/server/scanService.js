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
import { getDiskList, isWindows, hasAccess, toSystemPath, getDirAndName, toDiskAndPath } from './platformUtils.js'
import { scanDir, getFileObject, lowercaseFirstLetter } from './utils.js'

const exec = util.promisify(child_process.exec)

export const getDirSystemPath = async dir => {
    const disks = await getDisks()
    const diskName = disks.find(d => d.id == dir.disk)?.name
    return await toSystemPath(diskName, dir.dir, dir.name)
}

export const runScanCycle = async () => {
    const unscannedDirRecord = await getUnscannedDir()
    console.log('unscanned dir: ', unscannedDirRecord)
    if (!unscannedDirRecord) return null
    const { disk } = unscannedDirRecord
    const dirToScan = await getDirSystemPath(unscannedDirRecord)
    if (!dirToScan) return null

    console.log('run scan cycle: ', dirToScan)

    const files = await scanDir(dirToScan)
    
    const addDisk = dirObject => ({
        ...dirObject,
        disk,
    })
    const filesWithDisk = files.map(addDisk)
    console.log('files:', filesWithDisk)
    try {
        await save(filesWithDisk)
        await updateDirScanTime(unscannedDirRecord.id)
    } catch (e) {
        console.log('Error saving or updating scanning time', e)
        throw e
    }
    return unscannedDirRecord
}

export const initScan = async () => {
    const scanningPaths = await getScanningPaths()

    for await (const path of scanningPaths) {
        // TODO: is diskName needed?
        const { systemPath, diskName } = path
        console.log('scanning path', systemPath)
        const dirObject = await getFileObject(systemPath)
        if (!dirObject) continue
        
        const dirObjectWithDisk = {
            ...dirObject,
            disk: path.disk,
        }
        console.log(path.path, '--', dirObjectWithDisk)
        await save(dirObjectWithDisk)
    }
}

export const addScanningPath = saveScanningPath

export const resolvePaths = async paths => {
    const disks = await getDisks()
    const promises = paths.map(async path => {
        const diskName = disks.find(d => d.id == path.disk)?.name
        const systemPath = await toSystemPath(diskName, path.path)
        const available = await hasAccess(systemPath)
        return { ...path, available, systemPath, diskName }
    })

    return await Promise.all(promises)
}

export const getScanningPaths = async () => {
    const rawScanningPaths = await getDbScanningPaths()
    return resolvePaths(rawScanningPaths)
}

export const getMountedDisks = async () => {
    return getDiskList()
}