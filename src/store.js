import { createStore, applyMiddleware, compose } from 'redux'
import { requester } from './middleware'

const initialState = {
    scanningState: 0,
    stats: null,
    files: null,
    dirs: null,
    disks: null,
    mountedDisks: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SCAN_START':
            return { ...state, scanningState: 1 }
        case 'SCAN_STOP':
            return { ...state, scanningState: 0 }
        case 'GET_FILES':
            return { ...state, files: [] }
        case 'GET_DIRS':
            return { ...state, dirs: [] }
        case 'SET_SCANNING_PATHS':
            return { ...state, scanningPaths: action.payload }
        case 'SET_FILES':
            return { ...state, files: action.payload }
        case 'SELECT_DIR':
            return { ...state, selectedDir: action.payload }
        case 'SET_DIRS':
            return { ...state, dirs: action.payload }
        case 'SET_STATS':
            return { ...state, stats: action.payload }
        case 'SET_DISKS':
            return { ...state, disks: action.payload }
        case 'SET_MOUNTED_DISKS':
            return { ...state, mountedDisks: action.payload }
        default:
            return state
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(reducer, composeEnhancers(applyMiddleware(requester)))
