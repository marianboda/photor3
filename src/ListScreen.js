import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { DirListing } from './DirListing'

export const ListScreen = () => {
    const dispatch = useDispatch()
    const getDirs = () => dispatch({ type: 'GET_DIRS' })

    const dirs = useSelector(state => state.dirs)
    const selectedDir = useSelector(state => state.selectedDir)
    // const scanningPaths = useSelector(state => state.scanningPaths);

    const handlePathClick = data => dispatch({ type: 'SELECT_DIR', payload: data.path })

    return (
        <div className="Scan-screen">
            <div>
                <Button size="mini" onClick={getDirs}>
                    LIST DIRS
                </Button>
            </div>
            <DirListing dirs={dirs} selectedDir={selectedDir} onClick={handlePathClick} />
        </div>
    )
}
