import React from 'react'

const Activity = ({ onClick, completed, text }) => (
    <ion-item
        onClick={onClick}
        color={ completed ? 'primary' : 'none'}  
    >
        {text}
    </ion-item>
)

export default Activity