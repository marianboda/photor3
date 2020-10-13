import React from 'react';
import { useSelector } from 'react-redux';
import { MainMenu } from './MainMenu.js';

export const Header = props => {
    const stats = useSelector(state => state.stats);
    return (
        <header className="App-header">
            <div className="title">Photor III</div>
            <MainMenu />
            <div>
                Hashed {stats ? stats.hashedCount : '?'}, all {stats ? stats.allCount : '?'}
            </div>
        </header>
    );
};
