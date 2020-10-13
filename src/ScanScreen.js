import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { take } from 'ramda'
import { FileView } from './components/FileItem'
import { Button, Input, Dropdown, Divider } from 'semantic-ui-react'

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

    const [disk, setDisk] = useState(1)
    const [path, setPath] = useState('')

    useEffect(() => {
        dispatch({ type: 'GET_DISKS' })
        dispatch({ type: 'GET_MOUNTED_DISKS' })
        getScanningPaths()
    }, [])

    const renderScanningPath = i => (
        <li style={{color: i.available ? '#009966' : '#777777'}}>
            {disks?.find(d => d.id === i.disk)?.name} &gt; {i.path}
        </li>
    )
    
    return (
        <div className="Scan-screen">
            <div>
                <Dropdown
                    placeholder='Select Country'
                    className='mini input'
                    selection
                    value={disk}
                    onChange={(_, { value }) => setDisk(value)}
                    options={disks?.map(i => ({ text: i.name, value: i.id, key: i.id })) || []}
                />

                <Input value={path} onChange={e => setPath(e.target.value)} size="mini" />
                <Button icon="plus" size="mini" onClick={() => saveScanningPath(disk, path)} />
            </div>
            <div>
                <Button size="mini" onClick={() => scanStart(path)}>
                    SCAN START
                </Button>
                <Button size="mini" onClick={() => scanStop(path)}>
                    SCAN STOP
                </Button>
                <Button size="mini" onClick={processDeepest}>
                    PROCESS DEEPEST
                </Button>
                <Button size="mini" onClick={hashFile}>
                    HASH
                </Button>
                <Button size="mini" onClick={getScanningPaths}>
                    SCANNING_PATHS
                </Button>
                <Button size="mini" onClick={getFiles}>
                    LIST FILES
                </Button>
            </div>
            <Divider />
            <div>
                <h2>Scanning paths:</h2>
                <ul>{scanningPaths?.map(renderScanningPath)}</ul>
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
