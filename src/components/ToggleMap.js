import React from 'react'
import { withRouter } from 'react-router-dom'

let labelText = window.location.pathname === '/map' ? 'Show List' : 'Show Map';
const ToggleMap = withRouter(({ history }) => (
    <ion-button
        type='button'
        onClick={() => {
            if (window.location.pathname === '/map') {
                labelText = 'Show Map';
                history.push('/');
            }
            else {
                labelText = 'Show List';
                history.push('/map');
            }
        }}
    >
        {labelText}
    </ion-button>
))

export default ToggleMap