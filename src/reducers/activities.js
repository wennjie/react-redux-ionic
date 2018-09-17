import {
    REQUEST_ACTIVITIES,
    RECEIVE_ACTIVITIES,
    ADD_ACTIVITY
} from '../actions/activities'


function activities(
    state = {
        isFetching: false,
        didInvalidate: false,
        activities: [],
        activity: {}
    },
    action
) {
    switch (action.type) {
        case ADD_ACTIVITY:
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        case REQUEST_ACTIVITIES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_ACTIVITIES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                activities: action.activities,
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}

export default activities