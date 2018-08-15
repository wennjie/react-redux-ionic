import React from 'react'
import { withRouter } from 'react-router-dom'

const BackButton = withRouter(({ history }) => (
    <ion-button
        onClick={() => { history.goBack() }}
    >
        <ion-icon name="arrow-back"></ion-icon>
  </ion-button>
))

export default BackButton