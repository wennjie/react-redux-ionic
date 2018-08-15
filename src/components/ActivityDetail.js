import React from 'react'
import { withRouter } from 'react-router-dom'

const ActivityDetail = withRouter(({ activity, showActivityDetail, history }) => (
    <div>
        <ion-item mode="ios">
            <ion-label position="stack">Company</ion-label>
            <ion-text>{activity.company.name}</ion-text>
        </ion-item>
        <ion-item mode="ios">
            <ion-label position="stack">Created by</ion-label>
            <ion-text>{activity.createdByUser.name}, {activity.organization.name}</ion-text>
        </ion-item>
        <ion-item mode="ios">
            <ion-label position="stack">Category</ion-label>
            <ion-text>{activity.category.name}</ion-text>
        </ion-item>
        <ion-item mode="ios">
            <ion-label position="stack">Contacts</ion-label>
                <ion-text>
                    {activity.contacts.map(contact =>
                        <span key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</span>
                    )}
                </ion-text>
        </ion-item>     
    </div>
))

export default ActivityDetail