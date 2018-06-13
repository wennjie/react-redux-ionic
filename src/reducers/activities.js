const activities = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ACTIVITY':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        case 'TOGGLE_ACTIVITY':
            return state.map(activity =>
                (activity.id === action.id)
                    ? { ...activity, completed: !activity.completed }
                    : activity
            )
        default:
            return state
    }
}

export default activities