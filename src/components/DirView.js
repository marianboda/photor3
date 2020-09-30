import React from 'react'
import { Label } from 'semantic-ui-react'
import { last } from 'ramda'
import { Link } from 'react-router-dom'

const getImageNumber = filename => {
    const match = filename.match(/IMG_([0-9]{3,5}).[A-Za-z0-9]{3}$/)
    console.log(match)
    if (!match) return null
    return +match[1]
}

const getFractionColor = fraction => {
    if (fraction >= 2) return 'teal'
    if (fraction >= 1.2) return 'yellow'
    if (fraction < 0.8) return 'red'
    return 'orange'
}

export const DirView = ({ data, onClick }) => {
    console.log(data)
    // const { filesCount, firstFile, lastFile } = data

    // const firstFileType = last(firstFile.split('.'))
    // const lastFileType = last(lastFile.split('.'))

    // const isRawAndJpg = firstFileType === 'CR2' && lastFileType === 'JPG'
    // const multiplier = isRawAndJpg ? 2 : 1

    // const firstNumber = getImageNumber(firstFile)
    // const lastNumber = getImageNumber(lastFile)

    // const numberRange = firstNumber && lastNumber ? lastNumber - firstNumber : null

    // const fraction = numberRange / (filesCount / multiplier)

    const handlePathClick = () => onClick(data)

    // console.log('extensions', firstFileType, lastFileType)

    return (
        <div style={{ padding: 2 }}>
            {/* <Label color="orange" horizontal>
                {data.filesCount}
            </Label> */}
            <span onClick={handlePathClick}>{data.name} {data.path}</span>

            {/* {' '} */}
            {/* {numberRange + ' ' + filesCount / multiplier} */}
            {/* {isRawAndJpg && (
                <Label color="violet" horizontal>
                    RAW + JPG
                </Label>
            )}
            {numberRange && (
                <Label color={getFractionColor(fraction)} horizontal>
                    {Math.round(fraction * 10) / 10}
                </Label>
            )} */}
        </div>
    )
}
