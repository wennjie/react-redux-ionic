import React from 'react'

const Link = ({ active, children, onClick }) => (
    <ion-button fill="clear"
        onClick={onClick}
        disabled={active}
    >
        {children}
    </ion-button>
)

export default Link