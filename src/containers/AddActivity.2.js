import React from 'react'
import { connect } from 'react-redux'
import { addActivity } from '../actions/activities'
import BackButton from '../components/BackButton'

const AddActivity = ({ dispatch }) => {
    let input

    return [
        <ion-header>
            <ion-toolbar>
                <ion-title>Add Activity</ion-title>
                    <ion-buttons slot="start">
                        <BackButton/>
                    </ion-buttons>
            </ion-toolbar>
        </ion-header>,
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    dispatch(addActivity(input.value))
                    input.value = ''
                }}
            >
                <ion-list>
                    <ion-item>
                        <ion-label color="primary" position="stacked">Title</ion-label>
                        <ion-input type="text" ref={node => input = node}></ion-input>
                    </ion-item>
                </ion-list>
                <ion-button type="submit" expand="full">
                    Add Activity
                </ion-button>
            </form>
            ]
}

export default connect()(AddActivity)