import React, { useState, useEffect, useRef } from 'react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import blogService from '../services/blogs'

import { useDispatch, useSelector } from 'react-redux'
import {initializedBlogs, addBlogAction} from '../reducers/blogReducer'


const Blogs = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)


  const blogFormRef = useRef()

  
  useEffect(() => {
    blogService.getAll().then(returnedBlogs =>{
      returnedBlogs.sort(function (a, b){
        return b.likes - a.likes
      })
      dispatch(initializedBlogs(returnedBlogs)) // setBlogs(blogs)
    }
    )  
  }, [])

  



  const addBlog = async (blogObj) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObj)
    dispatch(addBlogAction(returnedBlog)) // setBlogs(blogs.concat(returnedBlog))
    //setMessage("a new blog " + blogObj.title + " by " + blogObj.author + " added!")
    // setTimeout(() => {
    //   setMessage(null)
    // }, 5000)
  }

  const likeBlog = async (blog) => {
    await blogService.like(blog)
    
    const updatedBlogs = await blogService.getAll()
    updatedBlogs.sort(function (a, b){
      return b.likes - a.likes
    })

    //temp solution, should have a update reducer feature
    dispatch(initializedBlogs(updatedBlogs))
    // setBlogs(updatedBlogs)
  }

  const removeBlog = async (blog) => {
    if(window.confirm("are you sure?")){
      await blogService.remove(blog)
      const updatedBlogs = await blogService.getAll()
      updatedBlogs.sort(function (a, b){
        return b.likes - a.likes
      })
      //temp solution, should have a update reducer feature
      dispatch(initializedBlogs(updatedBlogs))
      //setBlogs(updatedBlogs)
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
        <div>
          <h2>blogs</h2>
          <h3>create new</h3>
          {blogForm()}

         
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog}/>
          )}
          
        </div>
    </div>
  )
}

export default Blogs