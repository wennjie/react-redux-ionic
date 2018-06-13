let nextActivityId = 0
export const addActivity = text => ({
    type: 'ADD_ACTIVITY',
    id: nextActivityId++,
    text
})

export const toggleActivity = id => ({
    type: 'TOGGLE_ACTIVITY',
    id
})