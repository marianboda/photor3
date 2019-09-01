export const requester = store => next => action => {
    switch (action.type) {
        case 'GET_FILES':
            fetch('/files').then(r => r.json())
                .then(r => store.dispatch({ type: 'SET_FILES', payload: r }))
            fetch('/stats').then(r => r.json())
                .then(r => store.dispatch({ type: 'SET_STATS', payload: r }))
            return next(action)
        default:
            return next(action)
    }
}
