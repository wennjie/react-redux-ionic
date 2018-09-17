import React from 'react'
import { withRouter } from 'react-router-dom'

const AddActivityLink = withRouter(({ history }) => (
    <ion-button
        type='button'
        onClick={() => { history.push('/add-activity') }}
        style={{
            marginLeft: '4px',
        }}
    >
        Add Activity
    </ion-button>
))

export default AddActivityLink