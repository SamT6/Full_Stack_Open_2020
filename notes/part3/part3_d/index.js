//npm install --save-dev nodemon
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

app.use(express.json())
app.use(cors())

/* implement our own middleware that 
prints information about every request that is sent to the server
*/
const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body) //body from incoming request, not response body from the server
  console.log('---')
  next() //yields control to the next middleware
}
app.use(requestLogger)


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

//Moving error handling into middleware, next
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if(note){ // if exist
            response.json(note)
        }
        else{
            response.status(404).end()
        }
    }).catch(error => {
        // console.log(error);
        // //response.status(500).end() //status code 500 internal server error
        // response.status(400).send({error: "malformatted id"}) //400 bad request
        next(error) 
        /*
        If next was called without a parameter, then the execution would simply move onto the next route or middleware. If the next function is called with a parameter, then the execution will continue to the error handler middleware.
        */
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)

    // response.status(204).end() //204 no content 

    Note.findByIdAndRemove(request.params.id)
    .then( result => {
        response.status(204).end()
    }).catch(error => next(error))
})

/* Math.max returns the maximum value of the numbers that are passed to it. 
However, notes.map(n => n.id) is an array so it can't directly be given as a parameter to Math.max. 
The array can be transformed into individual numbers by using the "three dot" spread syntax ....
*/

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if(body.content === undefined){
        return response.status(400).json({ // 400 bad request
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
        response.json(savedAndFormattedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }
    // Notice that the findByIdAndUpdate method receives a regular JavaScript object as its parameter, 
    // and not a new note object created with the Note constructor function.

    //By default, the updatedNote parameter of the event handler receives the original document without the modifications. We added the optional { new: true }parameter, which will cause our event handler to be called with the new modified document instead of the original.
    Note.findByIdAndUpdate(request.params.id, note, {new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})


//defining middleware functions that are only called if no route handles the HTTP request
const unknownEndpoint = (request, response) => {
    response.status(404).send({error:'unknown endpoint'})
}
app.use(unknownEndpoint)


//needs to come at the very end, after the unknown endpoints handler
const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if(error.name === 'CastError'){
        return response.status(400).send({error: "malformatted id"})
    }
    else if(error.name === "ValidationError"){
        return response.status(400).json({error: error.message})
    }

    next(error) // pass the error forward to the default Express error handler
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})