import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sort, prop, descend } from 'ramda';
import { DirView } from './components/DirView';

export const ListScreen = () => {
    const dispatch = useDispatch();
    const getDirs = () => dispatch({ type: 'GET_DIRS' });

    const dirs = useSelector(state => state.dirs);
    const scanningPaths = useSelector(state => state.scanningPaths);

    return (
        <div className="Scan-screen">
            <div>
                <button type="button" onClick={getDirs}>
                    LIST DIRS
                </button>
            </div>
            <div className="Files-content">
                <div>{dirs && sort(descend(prop('filesCount')), dirs).map(i => <DirView data={i} />)}</div>
            </div>
        </div>
    );
};
