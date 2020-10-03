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
    const getScanningPath = path => dispatch({ type: 'GET_SCANNING_PATHS', payload: { path } })
    const scanStart = () => dispatch({ type: 'SCAN_START' })
    const scanStop = () => dispatch({ type: 'SCAN_STOP' })

    const files = useSelector(state => state.files)
    const scanningPaths = useSelector(state => state.scanningPaths)
    const disks = useSelector(state => state.disks)

    const [disk, setDisk] = useState('')
    const [path, setPath] = useState('/Users/marianboda/temp/a')

    useEffect(() => {
        dispatch({ type: 'GET_DISKS' })
    }, [])

    return (
        <div className="Scan-screen">
            <div>
                <input type="text" value={disk} onChange={e => setDisk(e.target.value)} />
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
                <button type="button" onClick={getScanningPath}>
                    SCANNING_PATHS
                </button>
                <button type="button" onClick={getFiles}>
                    LIST FILES
                </button>
            </div>
            <div className="Files-content">
                <ul>{scanningPaths && scanningPaths.map(i => <li>{i.path}</li>)}</ul>
            </div>
            <div className="Files-content">
                <div>{files && take(30, files).map(i => <FileView data={i} />)}</div>
            </div>
            <div>
                <li>
                    {disks &&
                        disks.map(i => (
                            <li>
                                {i.caption} | [{i.fileSystem}] | {i.volumeName}
                            </li>
                        ))}
                </li>
            </div>
        </div>
    )
}
