import util from 'util'
import childProcess from 'child_process'
import { lowercaseFirstLetter } from './utils.js'

const exec = util.promisify(childProcess.exec)

export const isWindows = () => process.platform === 'win32'

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
    return []
}

export const pathToUnipath = async path => {
    if (isWindows()) {
        const volumeLetter = path.split(':')[0]
        const disks = await getDiskList()
        const disk = disks.find(d => d.deviceID === `${volumeLetter}:`)

        console.log(disks.map(d => d.deviceID).join(' , '))
        // console.log(disks[0])

        if (!disk) throw new Error(`Disk ${volumeLetter}: not found for file ${path}`)

        const name = disk.volumeName
        const serialNumber = disk.volumeSerialNumber
        console.log('name: ', name)
        console.log('serial', serialNumber)
    }
}