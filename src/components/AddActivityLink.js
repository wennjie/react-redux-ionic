import React from 'react'
import { withRouter } from 'react-router-dom'

const AddActivityLink = withRouter(({ history }) => (
    <button
        type='button'
        onClick={() => { history.push('/add-activity') }}
        style={{
            marginLeft: '4px',
        }}
    >
        Add Activity
    </button>
))

export default AddActivityLink