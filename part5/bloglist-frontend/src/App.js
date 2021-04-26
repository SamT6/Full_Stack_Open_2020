import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      blogs.sort(function (a, b){
        return b.likes - a.likes
      })
      setBlogs( blogs )
    }
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
      setUser(user)
      setUsername('')
      setPassword('')
    }catch(exception){
      setMessage("wrong credentials")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.location.reload();
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

  const addBlog = async (blogObj) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObj)
    setBlogs(blogs.concat(returnedBlog))
    setMessage("a new blog " + blogObj.title + " by " + blogObj.author + " added!")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const likeBlog = async (blog) => {
    await blogService.like(blog)
    
    const updatedBlogs = await blogService.getAll()
    updatedBlogs.sort(function (a, b){
      return b.likes - a.likes
    })
    setBlogs(updatedBlogs)
  }

  const removeBlog = async (blog) => {
    if(window.confirm("are you sure?")){
      await blogService.remove(blog)
      const updatedBlogs = await blogService.getAll()
      updatedBlogs.sort(function (a, b){
        return b.likes - a.likes
      })
      setBlogs(updatedBlogs)
    }
  }

  const blogForm = () => {
    return(
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog}/>
      </Togglable>
    )
  }

  return (
    <div>
      {
        message === null ?
        null :
        <div class="error">
          {message}
        </div>
      }

      {
        user === null ? 

        <div> 
          <h2>log in to application</h2>
          {loginForm()}
        </div>

        :

        <div>
          <h2>blogs</h2>
          <br/>
          <p>{user.name} logged-in</p>
          <button onClick={logout}>logout</button>
          <br/>
          <h2>create new</h2>
          {blogForm()}

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog}/>
          )}
        </div>
      }

    </div>
  )
}

export default App