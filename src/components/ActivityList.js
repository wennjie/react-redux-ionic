import React from 'react'
import Activity from './Activity'

const ActivityList = ({ activities, toggleActivity }) => (
    <div>
    <ion-list>
        {activities.map(activity =>
            <Activity
                key={activity.id}
                {...activity}
                onClick={() => toggleActivity(activity.id)}
            />
        )}
    </ion-list>
        </div>
)

export default ActivityList