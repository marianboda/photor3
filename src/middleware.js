async function post(path, body = {}) {
    return fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(r => r.json())
}

async function get(path, params) {
    const url = new URL(path, window.location.origin)
    if (params) url.search = new URLSearchParams(params).toString()
    return fetch(url)
        .then(r => r.json())
        .catch(e => console.error(e))
}

export const requester = store => next => action => {
    switch (action.type) {
        case 'GET_FILES':
            get('/files').then(r => store.dispatch({ type: 'SET_FILES', payload: r }))
            get('/stats').then(r => store.dispatch({ type: 'SET_STATS', payload: r }))
            return next(action)
        case 'SELECT_DIR':
            store.dispatch({ type: 'GET_DIRS', payload: action.payload })
            return next(action)
        case 'GET_DISKS': {
            get('/disks')
                .then(r => store.dispatch({ type: 'SET_DISKS', payload: r }))
                .catch(e => console.error(e))
            return next(action)
        }
        case 'GET_MOUNTED_DISKS': {
            get('/mounted-disks')
                .then(r => store.dispatch({ type: 'SET_MOUNTED_DISKS', payload: r }))
                .catch(e => console.error(e))
            return next(action)
        }
        case 'GET_DIRS': {
            const dir = action.payload
            const params = dir ? { dir: action.payload } : undefined
            get('/dirs', params)
                .then(r => store.dispatch({ type: 'SET_DIRS', payload: r }))
                .catch(e => console.error(e))
            return next(action)
        }
        case 'GET_SCANNING_PATHS':
            get('/scanning-paths').then(r =>
                store.dispatch({ type: 'SET_SCANNING_PATHS', payload: r }),
            )
            return next(action)
        case 'HASH_FILE':
            post('/hashFile').then(() => store.dispatch({ type: 'GET_FILES' }))
            return next(action)
        case 'SAVE_SCANNING_PATH':
            post('/scanning-path', action.payload).then(() => store.dispatch({ type: 'GET_FILES' }))
            return next(action)
        case 'SCAN_START':
            post('/scan-start', action.payload)
            return next(action)
        case 'SCAN_STOP':
            post('/scan-stop', action.payload)
            return next(action)
        case 'PROCESS_DEEPEST':
            post('/process-deepest-dir')
            return next(action)
        case 'WS_MESSAGE':
            const newAction = JSON.parse(action.payload)
            store.dispatch(newAction)
            return next(action)
        default:
            return next(action)
    }
}
