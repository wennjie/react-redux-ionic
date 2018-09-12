import { connect } from 'react-redux'
import { showActivityDetail } from '../actions/activities'
import MapView from '../components/MapView'
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
    showActivityDetail: id => dispatch(showActivityDetail(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapView)