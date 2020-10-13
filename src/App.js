import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from './Header';
import './App.scss';
import { ScanScreen } from './ScanScreen';
import { ListScreen } from './ListScreen';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="App-content">
                    <Switch>
                        <Route path="/scan">
                            <ScanScreen />
                        </Route>
                        <Route path="/list">
                            <ListScreen />
                        </Route>
                        <Route path="/">Home</Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
