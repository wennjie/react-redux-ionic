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
Header.js holds the links for filtering the list. When returning multiple components, you have the option of wrapping them in a div, or some other component/tag, or you can return an array of components. Here is an example of wrapping in a div tag:

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

And here's the same component using an array:

```javascript
import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions/filter'

const Header = () => [
    <span>Show: </span>,
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
        All
    </FilterLink>,
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
        Active
    </FilterLink>,
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
        Completed
    </FilterLink>
]

export default Header
```

Notice the comma separation. This is  of course just standard notation for separating elements in an array. Going forward, we will mostly stick to the array notation.

The diffence more than just syntax. Using wrappers can cause problems in cases where the component behaves differently if used as child element wrapped in a div. Most notable example is:

```jsx
const Table = () => (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
```

Where Columns is: 

```jsx
const Table = () => (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
```

In this case `<Table />` renders as:

```html
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Which is invalid html, because of the divs.

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

Generally, containers will have two methods and export them using the connect method. The methods are mapStateToProps and mapDispatchToProps. The names are well chosen. mapStateToProps takes a slice of the store and maps it to props for the component specified in the connect method.

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
                <button type="submit"> Add Activity </button>
            </form>
    )
}

export default connect()(AddActivity)
```

AddActivity.js has a form with an input field. The entered value is dispatched to the reducer. The reducer updates a new version of the store and returns it.

We now have a functional app using React and Redux. The app lets you input an activity, toggle its status and apply filtering for the list.

Next, we will separate the AddActivity form into it's own page and set up routing.

## Pages and Routing

We have pretty simple application with a list, filters and an input field. This is all cramped into App.js. Pretty soon this will get out of hand. Our AddActivity needs more fields, the list needs more details and we might add a search bar, etc. Pages are a nice abstraction for this. We create pages that consist of a number of components and containers. If we have multiple pages they can even share the same components and containers.

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

To activate routing we use `withHistory`. The withRouter higher-order component will inject the `history` object as a prop of the component.`history` is an HTML5 API builds a stack of pages for navigating. By using `withHistory` we are able to access the navigation stack without pushing props down through our components.

The AddActivityLink component is added as part of the header component

```jsx
import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions/filter'
import AddActivityLink from '../components/AddActivityLink'

const Header = () => [
        <span>Show: </span>,
        <FilterLink filter={VisibilityFilters.SHOW_ALL}>
            All
        </FilterLink>,
        <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
            Active
        </FilterLink>,
        <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
            Completed
        </FilterLink>,

        <AddActivityLink/>
]

export default Header
```

Similarly, we'll add a button on the AddActivity container to navigate back. Because we'll probably need this in many places, we'll create this button as a separate component. In the components folder add the file BackButton.js
`touch BackButton.js`

```jsx
import React from 'react'
import { withRouter } from 'react-router-dom'

const BackButton = withRouter(({ history }) => (
    <button
        onClick={() => { history.goBack() }}
    >
        Back
  </button>
))

export default BackButton
```

Our back-button utilizes the history API's `goBack()` method. This method will go back one step in the navigation stack. It is equivalent to using `go(-1)`.

Import the BackButton in the AddActivity container.

We have now set up routing and split our application into two pages.


## Ionic Components

Ionic provide a collection of UI components that is optimized for mobile use. Done right, they provide a near native look and feel. With some consideration they can also provide a good desktop experience.

### Setting it up

To use web components we need to import the components in our index.html file. We can get the components using a CDN or download the package and place it in the public folder.

For CDN add the following line just before the closing head-tag:

```html
<script src="https://unpkg.com/@ionic/core@4.0.0-alpha.7/dist/ionic.js"></script>
```

This can lead to some CORS issues where your browser will refuse to download scripts from a third-party site.

To avoid that, and to allow for offline development enviroment, we download the package using npm

`npm install @ionic/core`

In the /node_modules folder find and copy the @ionic folder to the /public folder.

Add the following lines just before the closing head-tag:

```html
<script src="%PUBLIC_URL%/@ionic/core/dist/ionic.js"></script>
<link rel="stylesheet" href="%PUBLIC_URL%/@ionic/core/css/ionic.min.css">
```

All ionic components are now available to use in the app. 

All ionic components must be wrapped in a single ion-app container. This will be added in the the root index.js file inside the router tag.

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

To create an app with a top toolbar and a scrollable area beneath, we use the ion-content component. The ion-content is placed beneath the header that will contain our toolbar.

```jsx
import React from 'react'
import Header from './components/Header'
import VisibleActivityList from './containers/VisibleActivityList'

const App = () => [
    <Header />,
    <ion-content>
      <VisibleActivityList />
    </ion-content>
]

export default App
```

In our header component we add the toolbar, that will have a set of buttons. We'll group the filtering buttons and place them to the left, and move the AddActivity button to the right.

We wrap the components in a <ion-header>. This will make sure the toolbar stays at the top. Notice we no longer need to return the components as an array, since it is now wrapped.

Inside the toolbar we have two sets of buttons. Using the ion-buttons component we can group, and place them to the left (start) or right (end).

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

In our Link, AddActivityLink, and BackButton components the button tag is replaced with ion-button, we remove the style attribute and add the attribute fill and set it to clear.

Also, in the BackButton we replace the text "Back" with an icon:

```jsx
<ion-icon name="arrow-back"></ion-icon>
```

### List

For the list we use the ion-list component. Basically we replace the ul tag with ion-list.

```jsx
import React from 'react'
import Activity from './Activity'

const ActivityList = ({ activities, toggleActivity }) => (
    <ion-list>
        {activities.map(activity =>
            <Activity
                key={activity.id}
                {...activity}
                onClick={() => toggleActivity(activity.id)}
            />
        )}
    </ion-list>
)

export default ActivityList
```

In the Activity component we replace the li tags with ion-item. Instead of the current strikethrough styling for completed activities, we want the whole row to change its color. We remove the style attribute and replace it with ionic's color attribute. If the activity is completed we set the row color to primary.

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

In the AddActivity container we add a toolbar in the same way we created the toolbar in the main component.

We wrap the input field in an ion-list and make the AddActivity button use the whole width of the screen.

```jsx
import React from 'react'
import { connect } from 'react-redux'
import { addActivity } from '../actions/activities'
import BackButton from '../components/BackButton'

const AddActivity = ({ dispatch,back }) => {
    let input

    return [
        <ion-header>
            <ion-toolbar>
                <ion-title>Add Activity</ion-title>
                    <ion-buttons slot="start">
                        <BackButton/>
                    </ion-buttons>
            </ion-toolbar>
        </ion-header>,
        <ion-content>
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
        </ion-content>
            ]
}

export default connect()(AddActivity)
```

## Asynchronous actions

With asynchronous actions we no longer have the simple flow: 
 - dispatch action -> update new state. 
 Instead we have: 
 - dispath action -> wait for reponse ->  if success, update new state. If failure, do something else.

Asynchronous actions can be many things but typically it's interactions with a data server. This complicates the otherwise clean Redux pattern even more. With Redux we dispatch an action, create a copy of the state with the updated information and update the UI. Our reducers are pure functions, meaning they rely only on the provided input and has no side effects. This can not be the case when we interact with a server. If the reducer makes a server request, the output is no longer strictly a function of its inputs. It may also affect data outside its output, eg. on the server. 

There are a number of ways to handle this. A popular way is using middleware. Middleware is software that sits between and action and a response or between an input and output. In this case we want middleware that picks up the action, modifies its payload, dispatch other actions, and forwards the modified action to the reducer.

In this way we keep our reducer clean, and without side effects. Of course, we still have side effects since request from a data server are inherently side effects. But it helps keeping our reducers lean and with a single responsibility: updating state.

### Thunk Middleware

For making server requests, Thunk is a popular library. First we install it:

`npm install redux-thunk --save`

and import it to the root index.js. The createStore method takes the method `applyMiddleware` as its second argument. This method, in turn, takes middleware as arguments. We will only add Thunk but this is where we would include middleware for logging and much more.

```jsx
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import rootReducer from './reducers'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
import AddActivity from './pages/AddActivityPage';
import thunkMiddleware from 'redux-thunk'

const store = createStore(rootReducer)

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
    )
)

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

We are making a requst to get a list of activities. Instead of a real server, we will just fetch a JSON file locally. The approach is exactly the same as fetching from a server without authentication.

In the ../public folder we add the folder called data. Here we create the file activities.json and add the following content:

```JSON
[
    {
        "id": "e3093417-81be-49c2-8503-93352d66fe2e",
        "category": {
            "id": 2,
            "name": "Email"
        },
        "startTimestamp": 1531209600000.0,
        "company": {
            "productionUnitNumber": null,
            "location": {
                "latitude": 55.2910616,
                "longitude": 12.31975895
            },
            "id": 2181900,
            "name": "My Company"
        },
        "contacts": [
            {
                "id": "ee23547b-23ba-4cc7-a592-21c0f6639897",
                "firstName": "John",
                "lastName": "Smith"
            }
        ],
        "isFavorite": false,
        "completedTimestamp": null,
        "organization": {
            "id": 1,
            "name": "My Organization"
        },
        "createdByUser": {
            "id": 1005,
            "name": "Sara Olsen"
        }
    },
    {
        "id": "382e3a58-80fb-4151-92ce-89cf315475ba",
        "category": {
            "id": 2,
            "name": "Email"
        },
        "startTimestamp": 1528722900000.0,
        "company": {
            "productionUnitNumber": null,
            "location": {
                "latitude": 55.93392463,
                "longitude": 11.58053358
            },
            "id": 2482259,
            "name": "Another Company"
        },
        "contacts": [
            {
                "id": "9164dae7-a796-443d-8617-1ff61d88176e",
                "firstName": "Michael",
                "lastName": "Larsen"
            }
        ],
        "isFavorite": false,
        "completedTimestamp": null,
        "organization": {
            "id": 1,
            "name": "My Organization"
        },
        "createdByUser": {
            "id": 1005,
            "name": "Sara Olsen"
        }
    }
]
```

In our activites.js in the actions folder we will create the actions for the request. We will create three methods:

1. fetchActivities
2. requestActivities
3. receiveActivities

`fetchActivities` is a wrapper for `requestActivities` and `receiveActivities`. It takes a query as its only argument, passes it to `requestActivities`, dispatch this to the reducer, and requests the data using the `fetch` method, which returns a promise. `requestActivities` sets the state to isFetching. When `fetch` has resolved we dispatch `receiveActivities`. This action updates the state with the returned data and sets isFetching to `false`.

Since we are switching to our mock data server, we will remove the current AddActivity medthod. Our activies.js in the action folder becomes:

```jsx
export const REQUEST_ACTIVITIES = 'REQUEST_ACTIVITIES'
export const RECEIVE_ACTIVITIES = 'RECEIVE_ACTIVITIES'
export const SHOW_ACTIVITY_DETAIL = 'SHOW_ACTIVITY_DETAIL'

export function showActivityDetail(id) {
    return dispatch => {
        dispatch({
            type: SHOW_ACTIVITY_DETAIL,
            id
        })
    }
}

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

function requestActivities(query) {
    return {
        type: REQUEST_ACTIVITIES,
        query
    }
}

function receiveActivities(json) {
    return {
        type: RECEIVE_ACTIVITIES,
        activities: json,
        receivedAt: Date.now()
    }
}

export function fetchActivities(query) {
    return dispatch => {
        dispatch(requestActivities(query))
        return fetch(`/data/activities.json`)
            .then(response => response.json())
            .then(json => dispatch(receiveActivities(json)))
    }
}
```

And the activities reducer becomes

```jsx
import {
    REQUEST_ACTIVITIES,
    RECEIVE_ACTIVITIES
} from '../actions/activities'


function activities(
    state = {
        isFetching: false,
        didInvalidate: false,
        activities: [],
        activity: {}
    },
    action
) {
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
        case REQUEST_ACTIVITIES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_ACTIVITIES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                activities: action.activities,
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}

export default activities
```

## Maps and Leaflet

### Setting up the map view

There are lots of options to display data on a map in React. Common Options are, of course, Google Maps. Google Maps are good looking and easy to work with, but the API is rather limited. Since the Terms Of Service prevents us from using another API, and because the Google Maps API is too limited for our puposes, we will use another map provider. For development, we will use OpenStreetMaps.

We use Leaflet as the API for manipulating the map. (moving, zooming, and displaying data).

First, add the Leaftlet stylesheets and scripts to the index.html, just before the closing head-tag

```html
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css" integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
      crossorigin="" />
    <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js" integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
      crossorigin=""></script>
```

Leaflet directly manipulates  the DOM. This can cause conflicts with React. We therefore need to isolate the map from React. React-Leaflet is a library that does exactly this.

Install it using:

`npm install --save react-leaflet`

The map will have its own reusable component called MapView. In the component folder create the file `MapView.js`.

Add the following content:

```jsx
import React, { Component } from 'react'
import { Map, TileLayer } from 'react-leaflet'

const leafletContainer = {
    height: '92vh',
    width: '100vw',
    margin: 'auto'
}

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}

export default class MapView extends Component {
    state = {
        viewport: DEFAULT_VIEWPORT,
    }

    render() {
        return (
            <Map
                viewport={this.state.viewport}
                style = {leafletContainer}>
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </Map>
        )
    }
}
```

The component imports react-leaflet. We set the default zoom level and center in the object `DEFAULT_VIEWPORT`. Leaflet requires the height is set either as a fixed value or a percentage of the browsers viewport. Because our header takes up some space we set the height to 92vh instead of 100vh.

The component will be rendered in the page `ActivityMapPage.js` which has the following:

```jsx
import React from 'react'
import MapView from '../components/MapView'
import Header from '../components/Header'

const ActivityMapPage = (ownProps) => [
    <Header />,
    <ion-content>
        <MapView/>
    </ion-content>
]

export default ActivityMapPage
```

In the root `index.js` we import the `ActivityMapPage` and add the routing for the map with this line:

```jsx
<Route path="/map" component={ActivityMapPage} />
```

A map will now be shown if we type `/map` after the root URL. We do not want to manually type the path to the map. Instead we will add button to the header for toggleing the map and list view.

Create a file in the component folder called `ToggleMap.js` and insert

```jsx
import React from 'react'
import { withRouter } from 'react-router-dom'

let labelText = window.location.pathname === '/map' ? 'Show List' : 'Show Map';
const ToggleMap = withRouter(({ history }) => (
    <ion-button
        type='button'
        onClick={() => {
            if (window.location.pathname === '/map') {
                labelText = 'Show Map';
                history.push('/');
            }
            else {
                labelText = 'Show List';
                history.push('/map');
            }
        }}
    >
        {labelText}
    </ion-button>
))

export default ToggleMap
```
Using the withRouter higher level component we route to the path `/map` or to the root depending on the current URL. We also toggle the buttons label.

Insert the `<ToggleMap />` in the header component after `<AddActivityLink />`

### Adding markers

To make the map useful, we want to add markers for our datapoint. We connect the MapView component to our data store in the same way we did for the list - using a container. Create a copy of `VisibleActivityList.js` and rename it to `VisibleActivityMap.js`. The only changes we need to make is the import of the MapView component and exporting the MapView in connect().

```jsx
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
```

In `ActivityMapPage.js` we replace `<MapView/>` with the container `<VisibleActivityMap props={ownProps}/>`. Make sure to import it and remove the import of MapView. Nothing has really changed except that now we have access to our activities data in the MapView component.

To display the data we need three things: 1) data, 2) a marker for each data point, and 3) adjust the map viewport to fit the markers.

Data is already passed to the component from our container `<VisibleActivityMap props={ownProps}/>`. We then create a simple marker, a list of markers and add the marker to the map. Because state is handled by Redux we don't need state in our `MapView`. We therefor change `<MapView>` to a functional component. 

We create the function `getGeoBounds` to calculate the corners of the smallest rectangle that will fit all of the data points in activities.

```jsx
import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const leafletContainer = {
    height: '92vh',
    width: '100vw',
    margin: 'auto'
}

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}

const PopupMarker = withRouter(({ id, children, position, history }) => (
    <Marker
        position={position}
    >
    </Marker>
))

const MarkersList = ({ markers }) => {
    const items = markers.map(({ key, ...props }) => (
        <PopupMarker key={key} {...props} id={key} />
    ))
    return <div style={{ display: 'none' }}>{items}</div>
}

const getGeoBounds = (markers) => {
    let allLat = markers.reduce((prev, curr) => {
        return [...prev, curr.position[0]];
    }, []);
    let allLong = markers.reduce((prev, curr) => {
        return [...prev, curr.position[1]];
    }, []);

    let maxLat = Math.max.apply(Math, allLat);
    let minLat = Math.min.apply(Math, allLat);

    let maxLong = Math.max.apply(Math, allLong);
    let minLong = Math.min.apply(Math, allLong);

    let newBounds = this.bounds;

    if (allLat.length > 0) {
        let corner1 = [maxLat, maxLong],
            corner2 = [minLat, minLong];
        newBounds = [corner1, corner2];
    }

    return newBounds;
};
const MapView = (props) => {

    const markers = props.activities.activities.map(activity => {
        return {
            key: activity.id,
            position: [
                activity.company.location ? activity.company.location.latitude : 55,
                activity.company.location ? activity.company.location.longitude : 9
            ],
            children: activity.company.name
        }
    })

    const bounds = getGeoBounds(markers);

    return (
        <Map
            viewport={DEFAULT_VIEWPORT}
            bounds={bounds}
            style={leafletContainer}>
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkersList markers={markers} />
        </Map>
    )
 }

export default MapView
```

### Alert with navigation

Our markers are currently only displaying location of activities. We want them to be used for navigation as well. To do that we implement Ionic's Alert. This will display an alert box in the center of the viewport, and can have a list of clickable items.

As with every Ionic component the alert is a web component. It is activated using the `create()` method on the `ion-alert-controller` component. Using vanilla JS we would access this by using `document.querySelector('ion-alert-controller');`. Accesssing the DOM directly is not a good pattern in React. Instead we will use the `ref` attribute to get a reference to the web component and its method. This way we can access the components API without getting in the way of React.

We add the web component `<ion-alert-controller ref={activityAlert}>` somewhere between the two `<Map>` tags in the `MapView` component. The `ref` attribute means that you can create a reference called `activityAlert` to the web component somewhere in `MapView` by using the `createRef()` method. Within `MapView`, but before the `return ( <Map>...`  statement, add the line:

```jsx
const activityAlert = React.createRef();
```

We now have access to web component and all of its proporties and methods. This access is limited to anything within the `MapView` funcitonal component. We therefore have move some of our components, including `PopupMarker`, inside of of `MapView`. Another approach would be to use React's `forwardRef()` method. That way we could get access to ref from anywhere.

From the alert, the user should be able to navigate to the detail view for the activity and create a new activity.

Setting up the options on the alert is done using the options object on the `create()` method. The create method returns a promise so we use the `async` `await` pattern.

For our navigation we use the `withRouter()` method and wrap it around the `PopupMarker`. (why won't it work if we wrap it around `presentAlert()`?). That way we can forward the `history` to `presentAlert` and use `history.push()` in the options object when we create the alert.

When fetching the details view we reuse the same action we set up when navigating from the list. 

Here's the complete `MapView.js`:

```jsx
import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { withRouter } from 'react-router-dom'

const leafletContainer = {
    height: '92vh',
    width: '100vw',
    margin: 'auto',
    position: 'fixed'
}

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}

const presentAlert = async (id, companyName, history, ref, showActivityDetail) => {

    const alert = await ref.current.create({
        mode: 'ios',
        header: companyName,
        buttons: [{
            text: 'Info',
            role: 'details',
            handler: () => {
                history.push('/activity-detail/' + id);
                return showActivityDetail(id);
            }
        }, {
            text: 'Add Activity',
            handler: () => {
                history.push('/add-activity/');
            }
        }, {
            text: 'Add to Favorites',
            handler: () => {
                console.log('Favorite clicked');
            }
        }, {
            text: 'Close',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }]
    });
    await alert.present();
}


const getGeoBounds = (markers) => {
    let allLat = markers.reduce((prev, curr) => {
        return [...prev, curr.position[0]];
    }, []);
    let allLong = markers.reduce((prev, curr) => {
        return [...prev, curr.position[1]];
    }, []);

    let maxLat = Math.max.apply(Math, allLat);
    let minLat = Math.min.apply(Math, allLat);

    let maxLong = Math.max.apply(Math, allLong);
    let minLong = Math.min.apply(Math, allLong);

    let newBounds = this.bounds;

    if (allLat.length > 0) {
        let corner1 = [maxLat, maxLong],
            corner2 = [minLat, minLong];
        newBounds = [corner1, corner2];
    }

    return newBounds;
};
const MapView = (props) => {

    const markers = props.activities.activities.map(activity => {
        return {
            key: activity.id,
            position: [
                activity.company.location ? activity.company.location.latitude : 55,
                activity.company.location ? activity.company.location.longitude : 9
            ],
            children: activity.company.name
        }
    })

    const activityAlertController = React.createRef();

    const PopupMarker = withRouter(({ id, children, position, history }) => (
        <Marker
            position={position}
            onClick={() => { presentAlert(id, children, history, activityAlertController) }}
        >
        </Marker>
    ))

    const MarkersList = ({ markers }) => {
        const items = markers.map(({ key, ...props }) => (
            <PopupMarker key={key} {...props} id={key} />
        ))
        return <div style={{ display: 'none' }}>{items}</div>
    }

    const bounds = getGeoBounds(markers);

    return (
        <Map
            viewport={DEFAULT_VIEWPORT}
            bounds={bounds}
            style={leafletContainer}>
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ion-alert-controller ref={activityAlertController}/>
            <MarkersList markers={markers} />
        </Map>

    )
 }

export default MapView;
```