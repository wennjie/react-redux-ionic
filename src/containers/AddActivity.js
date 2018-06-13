import React from 'react'
import { connect } from 'react-redux'
import { addActivity } from '../actions/activities'

const AddActivity = ({ dispatch }) => {
    let input

    return (
        <div>
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
                <input ref={node => input = node} />
                <button type="submit">
                    Add Activity
        </button>
            </form>
        </div>
    )
}

export default connect()(AddActivity)