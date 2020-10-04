import util from 'util'
import os from 'os'
import childProcess from 'child_process'
import R from 'ramda'
import drivelist from 'drivelist'
import { lowercaseFirstLetter } from './utils.js'

const exec = util.promisify(childProcess.exec)

export const isWindows = () => os.platform() === 'win32'
export const isMac = () => os.platform() === 'darwin'
export const isUnix = () => ['freebsd', 'linux', 'openbsd'].includes(os.platform())

const getMacUsbDevices = async () => {
    const result = await exec('system_profiler -json SPUSBDataType')
}

const parseDrive = str => {
    if (str === '') return null
    return str.split('\r\r\n').reduce((acc, el) => {
        const [key, value] = lowercaseFirstLetter(el).split('=')
        if (key === '') return acc
        return { ...acc, [key]: value }
    }, {})
}

export const getDiskList = async () => {
    if (isWindows()) {
        const command = 'wmic logicaldisk list / format:list'
        const result = await exec(command)
        return result.stdout
            .split('\r\r\n\r\r\n')
            .map(parseDrive)
            .filter(i => !!i)
    }
    if (isMac() || isUnix()) {
        const drives = await drivelist.list()
        const mountPoints = R.compose(
          R.without(['VM', 'Recovery']),
          R.uniq,
        )(drives.map(d => d.mountpoints).flat().map(d => d.label))
        return mountPoints.map(i => ({ volumeName: i }))
    }

    throw new Error('Unknown platform ' + os.platform())
}

export const pathToUnipath = async (disk, path) => {
    if (isWindows()) {
        const volumeLetter = path.split(':')[0]
        const disks = await getDiskList()
        const disk = disks.find(d => d.deviceID === `${volumeLetter}:`)

        console.log(disks.map(d => d.deviceID).join(' , '))

        if (!disk) throw new Error(`Disk ${volumeLetter}: not found for file ${path}`)

        const name = disk.volumeName
        const serialNumber = disk.volumeSerialNumber
        console.log('name: ', name)
        console.log('serial', serialNumber)
    }
    if (isMac() || isUnix()) {
        if (!disk && path.match(/^\/Volumes\//)) {
            return path.replace(/^\/Volumes\//, '')
        }

        const sanitizedPath = path.replace(/^\//, '')
        return (`${disk}/${sanitizedPath}`)
    }
}

export const unipathToPath = unipath => {
    if (isWindows()) {
        console.log('not implemented yet')
    }
    if (isMac() || isUnix()) {
        return `/Volumes/${unipath}`
    }
}