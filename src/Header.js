import React from 'react'
import { useSelector } from 'react-redux'

export const Header = (props) => {
    const stats = useSelector(state => state.stats)
    return (
        <header className="App-header">
            <h1>
                Photor III
            </h1>
            <div>
                Hashed {stats ? stats.hashedCount : '?'}, all {stats ? stats.allCount : '?'}
            </div>
        </header>
    )
    }
