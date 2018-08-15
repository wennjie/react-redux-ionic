import React from 'react'
import BackButton from '../components/BackButton'

const ActivityDetailHeader = () => (
    <ion-header>
        <ion-toolbar>
            <ion-title>Activity Detail</ion-title>
            <ion-buttons slot="start">
                <BackButton />
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
)

export default ActivityDetailHeader