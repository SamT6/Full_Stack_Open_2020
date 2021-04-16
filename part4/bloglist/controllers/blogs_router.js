require('dotenv').config()
const blogsRouter = require('express').Router()
const Blog = require('../models/blog_model')
const User = require('../models/user_model')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer')){
      return authorization.substring(7)
  }
  return null
}


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    if(blogs){
      response.json(blogs)
    }
    else{
      response.status(404).end()
    }
  })
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  //const token = getTokenFrom(request)
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!request.token || !decodedToken.id){ //If there is no token, or the object decoded from the token does not contain the user's identity (decodedToken.id is undefined), error status code 401 unauthorized is returned
      return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
  
    if(body.title == undefined && body.url == undefined){
      response.status(400).end()
    }
    else{
      const blog = new Blog({
        ...body,
        likes: body.likes || 0, // default the likes to 0 if missing
        user: user._id
      })
    
      const result = await blog.save()
      user.blogs = user.blogs.concat(result._id)
      await user.save()
  
      response.status(201).json(result)
    }
  
  }catch(error){
      return response.status(401).json({error: error})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.status(200).json(updatedNote)
})


//  to register a middleware only for a specific operation:
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try{
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    
    if(blog.user.toString() == user.id.toString()){
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    else{
      return response.status(401).json({error: 'no access'})
    }

  }catch(error){
    return response.status(401).json({error: error})
  }
  
  
})
  
module.exports = blogsRouter