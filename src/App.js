import React from 'react';
import { Header } from './Header';
import './App.scss';
import { ScanScreen } from './ScanScreen';

function App() {
    return (
        <div className="App">
            <Header />
            <ScanScreen />
        </div>
    );
}

export default App;
