const notesRouter = require('express').Router()
const { findById } = require('../models/note')
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    return null
}
 

notesRouter.get('/', async (request, response) => {
    // Note.find({}).then(notes => {
    //   response.json(notes)
    // })

    const notes = await Note.find({}).populate('user', {username: 1, name: 1})
    response.json(notes)
})
  
notesRouter.get('/:id', async (request, response, next) => {
    // Note.findById(request.params.id)
    //     .then(note => {
    //     if (note) {
    //         response.json(note)
    //     } else {
    //         response.status(404).end()
    //     }
    //     })
    //     .catch(error => next(error))
    //OR
    // try{
    //     const note = await Note.findById(request.params.id)
    //     if(note){
    //         response.json(note)
    //     } else{
    //         response.status(404).end()
    //     }
    // }
    // catch(exception){
    //     next(exception)
    // }
    //Using express-async-errors library
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

notesRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id){ //If there is no token, or the object decoded from the token does not contain the user's identity (decodedToken.id is undefined), error status code 401 unauthorized is returned
        return response.status(401).json({error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
    })

    // note.save()
    //     .then(savedNote => {
    //         response.json(savedNote)
    //     })
    //     .catch(error => next(error))
    //OR
    // try{
    //     const savedNote = await note.save()
    //     response.json(savedNote)
    // }
    // catch(exception){
    //     next(exception)
    // }
    //Using express-async-errors library
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
    // Note.findByIdAndRemove(request.params.id)
    //     .then(() => {
    //     response.status(204).end()
    //     })
    //     .catch(error => next(error))
    //OR
    // try{
    //     await Note.findByIdAndRemove(request.params.id)
    //     response.status(204).end()
    // }
    // catch(exception){
    //     next(exception)
    // }
    //Using express-async-errors library
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()

})

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
        response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRouter