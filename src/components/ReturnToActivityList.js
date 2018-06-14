import React from 'react'
import { withRouter } from 'react-router-dom'

const ReturnToActivityList = withRouter(({ history }) => (
    <button
        type='button'
        onClick={() => { history.push('/') }}
        style={{
            marginLeft: '4px',
        }}
    >
        Return to Activities List
  </button>
))

export default ReturnToActivityList