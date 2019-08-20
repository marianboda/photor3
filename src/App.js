import React, { useState } from 'react'
import './App.css'

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
                <button type="button" onClick={handleClick}>OK</button>
            </div>
            <div>
                {files.map(i => <FileView data={i} />)}
            </div>
        </div>
    )
}

export default App
