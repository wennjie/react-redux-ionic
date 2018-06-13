import { combineReducers } from 'redux'
import activities from './activities'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
    activities,
    visibilityFilter
})