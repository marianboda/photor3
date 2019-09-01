import React, { useState } from 'react'
import './App.scss'

function FileView({ data }) {
    return (
        <div>
            {data.id} {data.path}
        </div>
    )
}

function scan(path) {
    console.log('will be scanning', path)
    fetch('/scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
    })
}

function processDeepest() {
    console.log('will be processing deepest')
    fetch('/processDeepestDir', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

function hashFile() {
    console.log('will be hashing')
    fetch('/hashFile', {
        method: 'POST',
    })
}

function App() {
    const [files, setFiles] = useState([])
    const [path, setPath] = useState('')

    const handleClick = () => {
        fetch('/files').then(r => r.json())
        .then(r => setFiles(r))
    }
    return (
        <div className="App">
            <header className="App-header">
                Photor III
            </header>
            <div>
                <input type="text" value={path} onChange={e => setPath(e.target.value)}/>
                <button type="button" onClick={() => scan(path)}>SCAN</button>
                <button type="button" onClick={processDeepest}>PROCESS DEEPEST</button>
                <button type="button" onClick={hashFile}>HASH</button>
                <button type="button" onClick={handleClick}>LIST FILES</button>
            </div>
            <div>
                {files.map(i => <FileView data={i} />)}
            </div>
        </div>
    )
}

export default App
