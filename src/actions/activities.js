export const ADD_ACTIVITY = 'ADD_ACTIVITY'
export const REQUEST_ACTIVITIES = 'REQUEST_ACTIVITIES'
export const RECEIVE_ACTIVITIES = 'RECEIVE_ACTIVITIES'
export const SHOW_ACTIVITY_DETAIL = 'SHOW_ACTIVITY_DETAIL'

export function addActivity(id) {
    return dispatch => {
        dispatch({
            type: ADD_ACTIVITY,
            id
        })
    }
}

export function showActivityDetail(id) {
    return dispatch => {
        dispatch({
            type: SHOW_ACTIVITY_DETAIL,
            id
        })
    }
}

function requestActivities(query) {
    return {
        type: REQUEST_ACTIVITIES,
        query
    }
}

function receiveActivities(json) {
    return {
        type: RECEIVE_ACTIVITIES,
        activities: json,
        receivedAt: Date.now()
    }
}

export function fetchActivities(query) {
    return dispatch => {
        dispatch(requestActivities(query))
        return fetch(`/data/activities.json`)
            .then(response => response.json())
            .then(json => dispatch(receiveActivities(json)))
    }
}