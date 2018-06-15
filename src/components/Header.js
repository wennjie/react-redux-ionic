import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions/filter'
import AddActivityLink from '../components/AddActivityLink'

const Header = () => (
    <ion-header>
    <ion-toolbar>
        <ion-buttons slot="start">
            <FilterLink filter={VisibilityFilters.SHOW_ALL}>
                All
            </FilterLink>
            <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
                Active
            </FilterLink>
            <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
                Completed
            </FilterLink>
        </ion-buttons>
        <ion-buttons slot="end">
            <AddActivityLink/>
        </ion-buttons>
    </ion-toolbar>
    </ion-header>
)

export default Header