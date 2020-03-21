import React from 'react';
import { Label } from 'semantic-ui-react';

export const DirView = ({ data }) => (
    <div style={{ padding: 2 }}>
        <Label color="orange" horizontal>
            {data.filesCount}
        </Label>
        {data.path}
    </div>
);
