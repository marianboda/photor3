import { createStore, applyMiddleware, compose } from 'redux';
import { requester } from './middleware';

const initialState = {
    stats: null,
    files: null,
    dirs: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_FILES':
            return { ...state, files: [] };
        case 'SET_FILES':
            return { ...state, files: action.payload };
        case 'SET_STATS':
            return { ...state, stats: action.payload };
        default:
            return state;
    }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(requester)));
