import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { take } from 'ramda';
import { FileView } from './components/FileItem';

// function processDeepest() {
//     console.log('will be processing deepest')
//     fetch('/processDeepestDir', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
// }

export const ScanScreen = () => {
    const dispatch = useDispatch();
    const getFiles = () => dispatch({ type: 'GET_FILES' });
    const hashFile = () => dispatch({ type: 'HASH_FILE' });
    const processDeepest = () => dispatch({ type: 'PROCESS_DEEPEST' });
    const saveScanningPath = path => dispatch({ type: 'SAVE_SCANNING_PATH', payload: { path } });
    const scan = () => dispatch({ type: 'SCAN' });

    const files = useSelector(state => state.files);

    const [path, setPath] = useState('/Users/marianboda/temp/a');

    return (
        <div className="Scan-screen">
            <div>
                <input type="text" value={path} onChange={e => setPath(e.target.value)} />
                <button type="button" onClick={() => saveScanningPath(path)}>
                    ADD
                </button>
                <button type="button" onClick={() => scan(path)}>
                    SCAN
                </button>
                <button type="button" onClick={processDeepest}>
                    PROCESS DEEPEST
                </button>
                <button type="button" onClick={hashFile}>
                    HASH
                </button>
                <button type="button" onClick={getFiles}>
                    LIST FILES
                </button>
            </div>
            <div className="Files-content">
                <div>{files && take(30, files).map(i => <FileView data={i} />)}</div>
            </div>
        </div>
    );
};
