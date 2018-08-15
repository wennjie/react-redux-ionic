import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
import AddActivity from './pages/AddActivityPage';
import { fetchActivities } from './actions/activities'
import thunkMiddleware from 'redux-thunk'

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

store
    .dispatch(fetchActivities('reactjs'))
    .then(() => console.log(store.getState()))