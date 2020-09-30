import React from 'react'
import { sort, prop, descend } from 'ramda'
import { DirView } from './components/DirView'

export const DirListing = ({ selectedDir, dirs, onClick }) => {
    const parentItem = {
        name: '..',
        path: selectedDir,
    }

    return (
        <div>
            <h2>{selectedDir}</h2>
            <div className="Files-content">
                <div>
                    <DirView data={parentItem} onClick={onClick} />
                    {dirs &&
                        sort(descend(prop('filesCount')), dirs).map(i => (
                            <DirView data={i} onClick={onClick} />
                        ))}
                </div>
            </div>
        </div>
    )
}
