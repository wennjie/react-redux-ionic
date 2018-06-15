import React from 'react'
import { withRouter } from 'react-router-dom'

const ReturnToActivityList = withRouter(({ history }) => (
    <ion-button
        onClick={() => { history.push('/') }}
    >
        <ion-icon name="arrow-back"></ion-icon>
  </ion-button>
))

export default ReturnToActivityList