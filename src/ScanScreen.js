import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { take } from 'ramda'
import { FileView } from './components/FileItem'

export const ScanScreen = () => {
    const dispatch = useDispatch()
    const getFiles = () => dispatch({ type: 'GET_FILES' })
    const hashFile = () => dispatch({ type: 'HASH_FILE' })
    const processDeepest = () => dispatch({ type: 'PROCESS_DEEPEST' })
    const saveScanningPath = (disk, path) => dispatch({ type: 'SAVE_SCANNING_PATH', payload: { disk, path } })
    const getScanningPaths = () => dispatch({ type: 'GET_SCANNING_PATHS' })
    const scanStart = () => dispatch({ type: 'SCAN_START' })
    const scanStop = () => dispatch({ type: 'SCAN_STOP' })

    const files = useSelector(state => state.files)
    const scanningPaths = useSelector(state => state.scanningPaths)
    const disks = useSelector(state => state.disks)
    const mountedDisks = useSelector(state => state.mountedDisks)

    const [disk, setDisk] = useState('')
    const [path, setPath] = useState('/Users/marianboda/temp/a')

    useEffect(() => {
        dispatch({ type: 'GET_DISKS' })
        dispatch({ type: 'GET_MOUNTED_DISKS' })
        getScanningPaths()
    }, [])

    return (
        <div className="Scan-screen">
            <div>
                <select onChange={e => setDisk(e.target.value)} value={disk}>
                    {disks?.map(i => <option value={i.id}>{i.name}</option>)}
                </select>
                <input type="text" value={path} onChange={e => setPath(e.target.value)} />
                <button type="button" onClick={() => saveScanningPath(disk, path)}>
                    ADD
                </button>
                <button type="button" onClick={() => scanStart(path)}>
                    SCAN START
                </button>
                <button type="button" onClick={() => scanStop(path)}>
                    SCAN STOP
                </button>
                <button type="button" onClick={processDeepest}>
                    PROCESS DEEPEST
                </button>
                <button type="button" onClick={hashFile}>
                    HASH
                </button>
                <button type="button" onClick={getScanningPaths}>
                    SCANNING_PATHS
                </button>
                <button type="button" onClick={getFiles}>
                    LIST FILES
                </button>
            </div>
            <div>
                <h2>Scanning paths:</h2>
                <ul>{scanningPaths && scanningPaths.map(i => <li style={{color: i.available ? '#009966' : '#777777'}}>{disks.find(d => d.id === i.disk)?.name} > {i.path}</li>)}</ul>
            </div>
            <div className="Files-content">
                <div>{files && take(30, files).map(i => <FileView data={i} />)}</div>
            </div>
            <div>
                <h2>Mounted disks:</h2>
                <ul>
                    {mountedDisks &&
                        mountedDisks.map(i => (
                            <li>
                                {i.caption} | [{i.fileSystem}] | {i.volumeName}
                            </li>
                        ))}
                </ul>
            </div>
            <div>
                <h2>Saved disks:</h2>
                <ul>
                    {disks &&
                        disks.map(i => (
                            <li>
                                {i.id} | {i.name}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    )
}
