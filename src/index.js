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