import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.scss';

export const MainMenu = () => {
    return (
        <ul className="Main-menu">
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/scan">Scan</Link>
            </li>
        </ul>
    );
};
