import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({box, imageUrl}) => {
    console.log('box',box)
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' 
                    src={imageUrl} 
                    alt='' 
                    width='500px' 
                    height='auto' 
                    />
                {
                box.length
                    ? box.map((item, index) => {
                        return (
                            <div
                            key={index}
                            className="bounding-box"
                            style={{
                                top: item.topRow,
                                left: item.leftCol,
                                bottom: item.bottomRow,
                                right: item.rightCol
                            }}
                            />
                        )
                        })
                    : ''
                }
            </div>
        </div>
    )
}

export default FaceRecognition;