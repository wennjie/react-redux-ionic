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