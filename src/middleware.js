async function post(path, body = {}) {
    return fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(r => r.json())
}

async function get(path, body) {
    return fetch(path).then(r => r.json())
}

export const requester = store => next => action => {
    switch (action.type) {
        case 'GET_FILES':
            get('/files')
                .then(r => store.dispatch({ type: 'SET_FILES', payload: r }))
            get('/stats')
                .then(r => store.dispatch({ type: 'SET_STATS', payload: r }))
            return next(action)
        case 'HASH_FILE':
            post('/hashFile')
                .then(r => store.dispatch({ type: 'GET_FILES' }))
            return next(action)
        case 'SAVE_SCANNING_PATH':
            post('/scanning-path', action.payload)
                .then(r => store.dispatch({ type: 'GET_FILES' }))
            return next(action)
        case 'SCAN':
            post('/scan', action.payload);
            return next(action);
        default:
            return next(action)
    }
}
