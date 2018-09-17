import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from './App'
import AddActivityPage from './pages/AddActivityPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import { fetchActivities } from './actions/activities'
import thunkMiddleware from 'redux-thunk'
import ActivityMapPage from './pages/ActivityMapPage';

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
                <Route path="/add-activity" component={AddActivityPage} />
                <Route path="/activity-detail/:id" component={ActivityDetailPage} />
                <Route path="/map" component={ActivityMapPage} />
            </ion-app>
        </Router>
    </Provider>,
    document.getElementById('root')
)

store
    .dispatch(fetchActivities('reactjs'))
    .then(() => console.log(store.getState()))