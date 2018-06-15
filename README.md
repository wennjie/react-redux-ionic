## Introduction

This is a prototype and a guide to build an SPA based on React and Redux, and using some Ionic Core components.

The prototype will consist of a list of activities, a form to add and activity, and some filtering.

Next steps are

- Authentication using Auth0
- AJAX requests
- Display data on a map
- Form validators
- Optimize performance with classes
- Unit tests
- Animation and transitions
- Service worker for PWA
- Save ionic library locally (in public folder)

## The basics

run 
`create-react-app react-redux-ionic`
To create the basic app and structure.
Install the libraries necessary for Redux
`cd react-redux-ionic`
Redux depends on the JSON scheme validator ajv, so we install that
`npm install ajv --save`
and the redux library itself
`npm install redux --save`
plus bindings for react
`npm install react-redux --save` 

We'll create a couple of directories we'll need for Redux
`cd src && mkdir actions reducers`
And a directory we'll need for all our components and containers
`mkdir components containers`


Redux consists of a store, a reducer and actions. The store holds the applications state, which can define both the current UI (is a list visible) and the data (in the list). The actions declares what changes to application's state you intend to make. The reducers handles the actions and updates the state.

To keep our code readable we will follow best practice and separate our reducers and actions into files with a logical grouping.

### Actions

You can think of actions as a catalogue of interaction that is possible with the application. An action has a unique name (type) and (sometimes) a definition of what data input that goes along with the action.

In the folder actions create the files activies.js and filter.js
`touch activities.js filter.js`

In activites we'll add two actions: one for adding and activity and one for toggleing the status of an activity.

```javascript
let nextActivityId = 0
export const addActivity = text => ({
    type: 'ADD_ACTIVITY',
    id: nextActivityId++,
    text
})

export const toggleActivity = id => ({
    type: 'TOGGLE_ACTIVITY',
    id
})
```

In filter we add

```javascript
export const setVisibilityFilter = filter => ({
    type: 'SET_VISIBILITY_FILTER',
    filter
})

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}
```

`setVisibilityFilter` is a function that takes an input called filter. The type is always 'SET_VISIBILITY_FILTER'. VisibilityFilters is just a collection of constants.

### Reducers

Reducers receive a and action. The action's type tells the reducer how to handle it. The reducer then takes the data from the action, updates the state and returns it.

In our reducers folder we create two reducers; activities and visibilityFilter, and a reducer to combine the two:

`touch activities.js visibilityFilter.js index.js`

The activities reducer will handle two actions add an activity and toggle an activity

```javascript
const activities = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ACTIVITY':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        case 'TOGGLE_ACTIVITY':
            return state.map(activity =>
                (activity.id === action.id)
                    ? { ...activity, completed: !activity.completed }
                    : activity
            )
        default:
            return state
    }
}
export default activities
```

The visibility reducer has only one method but it depends on input from some actions, which we will add shortly. The default state of the filter is SHOW_ALL. The reducer's method takes an input and returns it.

```javascript
import { VisibilityFilters } from '../actions/filter'

const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter
        default:
            return state
    }
}

export default visibilityFilter
```

We use Redux' CombineReducers method to combine the two in index.js in the reducers folder

```javascript
import { combineReducers } from 'redux'
import activities from './activities'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
    activities,
    visibilityFilter
})
```

To wrap it up we need instatiate our reducers in the root index.js. We import the rootReducer, which is the combination of our two reducers: activities and visibilityFilter. Our App component then needs to be wrapped inside a Provider tag with the store attribute.

```javascript
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import App from './App'

const store = createStore(rootReducer)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
```

That's the basic setup. We have the structure of our app in place, added redux, and created some actions.

## Presentational Components and Containers

Components are where we create the actual user interface. To keep things manageable we will use the pattern of splitting our component into Presentational Components and Containers. Presentational Components receives data, adds styling and nothing else. They do not handle user interactions and are not connected to the Redux store. That is the responsibility of Containers. There's a grey area here, and sometimes you will create small components that handle both data and presentation.

We'll create two folders components and containers.
`mkdir components containers`

### Presentational Components

Our Component 'tree' has the following structure:

App
 |_ Header
  |_ Link
 |_ ActivityList
  |_ Activity

Create the files in the Components folder

`touch Activity.js ActivityList.js Header.js Link.js`

In ActivityList.js add

```javascript
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
```
Activity.js is a single activity used in the list

```javascript
import React from 'react'

const Activity = ({ onClick, completed, text }) => (
    <li
        onClick={onClick}
        style={{
            textDecoration: completed ? 'line-through' : 'none'
        }}
    >
        {text}
    </li>
)

export default Activity
```
Header.js holds the links for filtering the list

```javascript
import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions/filter'

const Header = () => (
    <div>
        <span>Show: </span>
        <FilterLink filter={VisibilityFilters.SHOW_ALL}>
            All
    </FilterLink>
        <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
            Active
    </FilterLink>
        <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
            Completed
    </FilterLink>
    </div>
)

export default Header
```

And Link.js is a single link

```javascript
import React from 'react'

const Link = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        disabled={active}
        style={{
            marginLeft: '4px',
        }}
    >
        {children}
    </button>
)

export default Link
```

### Containers

We will create three containers

`touch VisibleActivityList.js FilterLink.js AddActivity.js`

Generally, containers will have to methods and export them using the connect method. The methods are mapStateToProps and mapDispatchToProps. The names are well chosen. mapStateToProps takes a slice of the store and maps it to props for the component specified in the connect method.

The clearest example of this is FilterLink.js.

```javascript
import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions/filter'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Link)
```

mapStateToProps takes the store and the components props as input, and returns `active` as a prop. The value is true if the value of visibilityFilter in the store is equal to the value of the components prop.

mapDispatchToProps dispatches actions to the reducer. The dispatched action is the value of the prop clicked in the compenent.

Let's go through an example:

In the Header the link All is active. That means that in the store, visibilityFiler has the value = SHOW_ALL and the prop filter is also equal to SHOW_ALL. The prop active is therefore true. If we click the filter item in the header called 'completed' the prob in the Filter component changes its value to SHOW_COMPLETED. The components prop and the store value are no longer equal and action changes to false. In the Filter component the disabled attribute is set by activity. Since it is now false the button is active (ready to be clicked)

The components prop value gets dispathced to the store. setVisibilityFilter maps the prop value to the corresponding action name. That name tells the reducer what to do. In this case, the reducer just returns the filter value.

In VisibleActivityList.js the filter value from the store is used to filter the activities in the list. So apart from the two methods: mapStateToProps and mapDispatchToProps we also have getVisibleActivities. Whenever the state changes getVisibleActivities runs through the list of activities. If in the store visibilityFilter is equal to SHOW_COMPLETED it returns only activities where the completed proporty is true. If activities is needed in other parts of the app, and if always need the same filtering then getVisibleActivities could (should?) be moved to the reducer instead.

```javascript
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
```

AddActivity.js is not strictly a container but a mix of a component and container. That is, its responsibility is both connecting to Redux and present data. We might decide to split it later, but for now we'll keep like this.

In VisibleActivityList.js 

```javascript
import React from 'react'
import { connect } from 'react-redux'
import { addActivity } from '../actions/activities'

const AddActivity = ({ dispatch }) => {
    let input

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    dispatch(addActivity(input.value))
                    input.value = ''
                }}
            >
                <input ref={node => input = node} />
                <button type="submit">
                    Add Activity
        </button>
            </form>
        </div>
    )
}

export default connect()(AddActivity)
```

AddActivity.js has a form with an input field. The entered value is dispatched to the reducer. The reducer updates a new version of the store and returns it.

We now have a functional app using React and Redux. The app lets you input an activity, toggle its status and apply filtering for the list.

Next, we will separate the AddActivity form into it's own page and set up routing.

## Pages and Routing

We have pretty simple application with a list, filters and and input field. This is all cramped into App.js. Pretty soon this will get out of hand. Our AddActivity needs more fields, the list needs more details and we might at a search bar, etc. Pages are a nice abstraction for this. We create pages that consist of a number of components and containers. If we have multiple pages they can even share the same components and containers.

We'll start by creating a page for our AddActivity container. First we create the pages folder
`mkdir pages`
In this folder we create the file AddActivityPage.js
`touch AddActivityPage.js`
With the content

```jsx
import React from 'react'
import AddActivity from '../containers/AddActivity'

const AddActivityPage = ({nav}) => (
    <AddActivity/>
)

export default AddActivityPage
```

For now, this is basically just a wrapper around the AddActivity container we made previously.

To be able to navigate from one page to another we need to implement routing. There are many options but we will user React Router.
`npm install --save react-router-dom`

Our root index.js will have to know about routing. We therefore replace <App/> with

```jsx
<Router>
    <Route exact path="/" component={App} />
    <Route exact path="/add-activity" component={AddActivity} />
</Router>
```

This tells the app to render App if the url exactly matches the specified path. We have specified two paths for routing: the root, which routes to our apps main component and a route to the AddActivity page.

We want to create a link to AddActivity as part of our header. First, we'll add a component with a button that activates the routing. In /components add the file AddActivityLink.js
`touch AddActivityLink.js`
And insert

```jsx
import React from 'react'
import { withRouter } from 'react-router-dom'

const AddActivityLink = withRouter(({ history }) => (
    <button
        type='button'
        onClick={() => { history.push('/add-activity') }}
        style={{
            marginLeft: '4px',
        }}
    >
        Add Activity
    </button>
))

export default AddActivityLink
```
To activate routing we use `withHistory`. The withRouter higher-order component will inject the history object as a prop of the component. This allows you to access the push and replace methods without having to deal with the context.

The AddActivityLink component is added as part of the header component

```jsx
import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions/filter'
import AddActivityLink from '../components/AddActivityLink'

const Header = () => (
    <div>
        <span>Show: </span>
        <FilterLink filter={VisibilityFilters.SHOW_ALL}>
            All
        </FilterLink>
        <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
            Active
        </FilterLink>
        <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
            Completed
        </FilterLink>

        <AddActivityLink/>
    </div>
)

export default Header
```

Similarly, we'll add a button on the AddActivity container to navigate back to the list. Because we'll probably need this in many places, we''l create this button as a separate component. In the components folder add the file ReturnToActivityList.js
`touch ReturnToActivityList.js`

```jsx
import { withRouter } from 'react-router-dom'

const ReturnToList = withRouter(({ history }) => (
    <button
        type='button'
        onClick={() => { history.push('/') }}
        style={{
            marginLeft: '4px',
        }}
    >
        Return to Activities List
  </button>
))
```

And add this to the AddActivity container.

We have now set up routing and split our application into two pages.


## Ionic Components

Ionic provide a collection of UI components that is optimized for mobile use. Done right, they provide a near native look and feel. With some consideration they can also provide a good desktop experience.

### Setting it up

First we'll import the library. Currently there is no way to do this using af module loader (npm or yarn). Instead we will add it manually to the index.html in the public folder. Add the following line just before the closing head-tag.
```html
`<script src="https://unpkg.com/@ionic/core@4.0.0-alpha.7/dist/ionic.js"></script>`
```

All ionic components are now available to use in the app. All ionic components should be wrapped in a single ion-app container. This will be added in the the root index.js file inside the router tag.

```jsx
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import rootReducer from './reducers'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
import AddActivity from './pages/AddActivityPage';

const store = createStore(rootReducer)

render(
  <Provider store={store}>
    <Router>
      <ion-app>
        <Route exact path="/" component={App} />
        <Route path="/add-activity" component={AddActivity} />
      </ion-app>
    </Router>
  </Provider>,
document.getElementById('root')
)
```

Now the app is set up for ionic components.

### Toolbar

To create and app with a top toolbar and a scrollable area beneath, we need to use the ion-content component and set the attribute fullscreen to true. The ion-content is placed beneath the header that will contain our toolbar.

```jsx
import React from 'react'
import Header from './components/Header'
import VisibleActivityList from './containers/VisibleActivityList'

const App = () => (
  <div>
    <Header />
    <ion-content fullscreen="true">
      <VisibleActivityList />
    </ion-content>
    </div>

)

export default App
```

In our header component we add the toolbar, that will have a set of buttons. We'll group the filtering buttons and place them to the left, and move the AddActivity button to the right.

In the header component we replace the outer most <div> with <ion-header>. This will make the toolbar stays at the top. Inside the toolbar we have two sets of buttons. Using the ion-buttons component we can group, and place them to the left (start) or right (end).
```jsx
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
```

In our Link and AddActivityLink components the button tag is replaced with ion-button, we remove the style attribute and add the attribute fill and set it to clear.

### List

For the list we use the ion-list component. Basically we replace the ul tag by ion-list and wrap the whole component in divs.

```jsx
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
```

In the Activity component we replace the li tags with ion-item. Instead of the current strikethrough styling for completed activities we want the whole row to change its color. We remove the style attribute and replace it with ionic's color attribute. If the activity is completed we set the row color to primary.

```jsx
import React from 'react'

const Activity = ({ onClick, completed, text }) => (
    <ion-item
        onClick={onClick}
        color={ completed ? 'primary' : 'none'}  
    >
        {text}
    </ion-item>
)

export default Activity
```

### Add Activity

Our AddActivity page needs a header too. Instead of the current button to navigate to the list we add a back button.

We use ion-button in the ReturnToActivityList component and replace the text with an icon.

```jsx
import React from 'react'
import { withRouter } from 'react-router-dom'

const ReturnToActivityList = withRouter(({ history }) => (
    <ion-button
        onClick={() => { history.push('/') }}
    >
        <ion-icon name="arrow-back"></ion-icon>
  </ion-button>
))

export default ReturnToActivityList
```

In the AddActivity container we add a toolbar in the same way we created the toolbar in the main component.

We wrap the input field in an ion-list and make the AddActivity button use the whole width of the screen.

```jsx
import React from 'react'
import { connect } from 'react-redux'
import { addActivity } from '../actions/activities'
import ReturnToActivityList from '../components/ReturnToActivityList'

const AddActivity = ({ dispatch,back }) => {
    let input

    return (
        <div>
        <ion-header>
            <ion-toolbar>
                <ion-title>Add Activity</ion-title>
                    <ion-buttons slot="start">
                        <ReturnToActivityList/>
                    </ion-buttons>
            </ion-toolbar>
        </ion-header>

            <form
                onSubmit={e => {
                    e.preventDefault()
                    if (!input.value.trim()) {
                        return
                    }
                    dispatch(addActivity(input.value))
                    input.value = ''
                }}
            >
                <ion-list>
                    <ion-item>
                        <ion-label color="primary" position="stacked">Title</ion-label>
                        <ion-input type="text" ref={node => input = node}></ion-input>
                    </ion-item>
                </ion-list>
                <ion-button type="submit" expand="full">
                    Add Activity
                </ion-button>
            </form>
            </div>
        
    )
}

export default connect()(AddActivity)
```
