import React from 'react'
import Header from './components/Header'
import AddActivity from './containers/AddActivity'
import VisibleActivityList from './containers/VisibleActivityList'

const App = () => (
  <div>
    <Header />
    <AddActivity />
    <VisibleActivityList />
  </div>
)

export default App