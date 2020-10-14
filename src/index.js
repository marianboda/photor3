import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { store } from './store'
import * as serviceWorker from './serviceWorker'
import 'semantic-ui-css/semantic.min.css'

const client = new WebSocket('ws://localhost:5000')
client.onopen = () => {
    client.send('Hello')
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
