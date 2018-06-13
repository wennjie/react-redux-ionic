import React from 'react'
import Activity from './Activity'

const ActivityList = ({ activities, toggleActivity }) => (
    <ul>
        {activities.map(activity =>
            <Activity
                key={activity.id}
                {...activity}
                onClick={() => toggleActivity(activity.id)}
            />
        )}
    </ul>
)

export default ActivityList