import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { userChange } from '../reducers/userReducer'
import loginService from '../services/login'

import {   
    useHistory,
  } from "react-router-dom"

const Login = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const history = useHistory() 

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username, password,
      })

      //store locally on browser
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      // blogService.setToken(user.token)
      dispatch(userChange(user)) //setUser(user)
      setUsername('')
      setPassword('')
      history.push('/')
    }catch(exception){
    //   setMessage("wrong credentials")
    //   setTimeout(() => {
    //     setMessage(null)
    //   }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type='text'
            value={username}
            name="Username"
            onChange={({target}) => setUsername(target.value)} //The event handlers are simple: An object is given to them as a parameter, and they destructure the field target from the object and save its value to the state.
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
  )


  return (
    <div> 
        <h2>log in to application</h2>
        {loginForm()}
    </div>    
  )
}

export default Login