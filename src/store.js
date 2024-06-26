import { createStore, applyMiddleware, compose } from 'redux';
import { requester } from './middleware.js';

const initialState = {
    stats: null,
    files: null,
    dirs: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_FILES':
            return { ...state, files: [] };
        case 'GET_DIRS':
            return { ...state, dirs: [] };
        case 'SET_SCANNING_PATHS':
            return { ...state, scanningPaths: action.payload };
        case 'SET_FILES':
            return { ...state, files: action.payload };
        case 'SET_DIRS':
            return { ...state, dirs: action.payload };
        case 'SET_STATS':
            return { ...state, stats: action.payload };
        default:
            return state;
    }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(requester)));
