// Published URL  ==>  https://saijobbywebapp.ccbp.tech

import {Redirect, Switch, Route} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

const App = () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route exact path="/login" component={LoginForm} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
