import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from './Header';
import './App.scss';
import { ScanScreen } from './ScanScreen';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/scan">
                        <ScanScreen />
                    </Route>
                    <Route path="/">Home</Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
