import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Users from './components/Users'
import Blogs from './components/Blogs'

import blogService from "./services/blogs"
import { userChange } from './reducers/userReducer'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useRouteMatch
} from "react-router-dom"
import Login from './components/Login'


const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(userChange(user)) // setUser(user)
    }
  }, [])


  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.location.reload();
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ?
          <div> 
            <em>{user.name} logged in</em>
            <button onClick={logout}>logout</button>
          </div> 
          : <Link style={padding} to="/login">login</Link>
        }
      </div>

      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/users">
          {user ? <Users /> : <Redirect to="/login" />}
        </Route>
        <Route path="/">
          {user ? <Blogs /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </div>
  )
}

export default App