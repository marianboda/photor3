import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MainMenu.scss';

const MenuLink = ({ link, text }) => {
    const { pathname } = useLocation();
    const className = pathname === link ? 'active' : '';
    return (
        <li className={className}>
            <Link to={link}>{text}</Link>
        </li>
    );
};

export const MainMenu = () => {
    // const params = useLocation()

    const links = [
        {
            link: '/',
            text: 'Home',
        },
        {
            link: '/scan',
            text: 'Scan',
        },
        {
            link: '/list',
            text: 'List',
        },
    ]

    return <ul className="Main-menu">{links.map(MenuLink)}</ul>;
};
