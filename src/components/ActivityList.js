import React from 'react'
import Activity from './Activity'
import { withRouter } from 'react-router-dom'
import SHOW_ACTIVITY_DETAIL from '../actions/activities'

const ActivityList = withRouter(({ activities, showActivityDetail, history }) => (
    <ion-list>
            {activities.activities.map(activity =>
            <Activity
                key={activity.id}
                    value={activity.id}
                {...activity}
                    onClick={() => { history.push('/activity-detail/'+ activity.id); return showActivityDetail(activity.id)}}
            />
        )}
    </ion-list>
))

export default ActivityList