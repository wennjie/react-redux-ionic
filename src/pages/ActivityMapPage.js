import React from 'react'
import VisibleActivityMap from '../containers/VisibleActivityMap';
import Header from '../components/Header'

const ActivityMapPage = (ownProps) => [
    <Header />,
    <ion-content>
        <VisibleActivityMap props={ownProps} />
    </ion-content>
]

export default ActivityMapPage