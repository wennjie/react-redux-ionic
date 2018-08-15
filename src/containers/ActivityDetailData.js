import { connect } from 'react-redux'
import { showActivityDetail } from '../actions/activities'
import ActivityDetail from '../components/ActivityDetail'

function getActivity(activities,id) {
    let singleActivity = {
            createdByUser: {name: ''},
            category: { name: '' },
            contacts: [{}],
            organization: { name: '' },
            company: { name: '' }
        }
    if (activities.activities && activities.activities.length > 0){
        singleActivity = activities.activities
            .find(activity => activity.id === id)
            console.log('getActivity',id)
        return singleActivity

    }
    return singleActivity
}


const mapStateToProps = (state,ownProps) => ({
    activity: getActivity(state.activities, ownProps.props.match.params.id)
})

const mapDispatchToProps = dispatch => ({
    showActivityDetail: id => dispatch(showActivityDetail(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivityDetail)