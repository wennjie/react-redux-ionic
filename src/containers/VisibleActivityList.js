import { connect } from 'react-redux'
import { toggleActivity } from '../actions/activities'
import ActivityList from '../components/ActivityList'
import { VisibilityFilters } from '../actions/filter'

const getVisibleActivities = (activities, filter) => {
    switch (filter) {
        case VisibilityFilters.SHOW_ALL:
            return activities
        case VisibilityFilters.SHOW_COMPLETED:
            return activities.filter(t => t.completed)
        case VisibilityFilters.SHOW_ACTIVE:
            return activities.filter(t => !t.completed)
        default:
            throw new Error('Unknown filter: ' + filter)
    }
}

const mapStateToProps = state => ({
    activities: getVisibleActivities(state.activities, state.visibilityFilter)
})

const mapDispatchToProps = dispatch => ({
    toggleActivity: id => dispatch(toggleActivity(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivityList)