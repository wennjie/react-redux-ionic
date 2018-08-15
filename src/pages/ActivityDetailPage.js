import React from 'react'
import ActivityDetailData from '../containers/ActivityDetailData'
import ActivityDetailHeader from '../components/ActivityDetailHeader'

const ActivityDetailPage = (ownProps) => (
    <div>
        <ActivityDetailHeader />
        <ActivityDetailData props={ownProps}/>
    </div>
)

export default ActivityDetailPage