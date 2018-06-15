import React from 'react'
import { withRouter } from 'react-router-dom'

const AddActivityLink = withRouter(({ history }) => (
    <ion-button
        type='button'
        onClick={() => { history.push('/add-activity') }}
    >
        Add Activity
    </ion-button>
))

export default AddActivityLink