import React from 'react'
import Header from './components/Header'
import VisibleActivityList from './containers/VisibleActivityList'

const App = () => [
    <Header />,
    <ion-content >
      <VisibleActivityList />
    </ion-content>

]

export default App