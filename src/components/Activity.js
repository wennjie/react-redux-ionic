import React from 'react'

const Activity = (
    { 
        onClick, 
        completed, 
        category, 
        contacts, 
        company, 
        createdByUser, 
        organization
    }) => (
    <ion-item
        onClick={onClick}
        color={ completed ? 'primary' : 'none'}  
        mode="ios"
    >
        <ion-label position="stack">
            {category.name}
            <ion-text>
                <h3>{contacts.map(contact =>
                        <span key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</span>
                    )}
                <span>, {company.name}</span>
                </h3>
                <h3>{createdByUser.name}, {organization.name}</h3>
            </ion-text>
        </ion-label>
    </ion-item>
)

export default Activity