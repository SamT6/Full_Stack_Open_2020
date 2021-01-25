//npm install --save-dev nodemon

const express = require('express')
const cors = require('cors')
const app = express()

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
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
    if(note){ //check if a note is found
        response.json(note)
    }
    else{
        response.status(404).end() //404 not found
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end() //204 no content 
})

/* Math.max returns the maximum value of the numbers that are passed to it. 
However, notes.map(n => n.id) is an array so it can't directly be given as a parameter to Math.max. 
The array can be transformed into individual numbers by using the "three dot" spread syntax ....
*/

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content){
        return response.status(400).json({ // 400 bad request
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)
    response.json(note)
})


//defining middleware functions that are only called if no route handles the HTTP request
const unknownEndpoint = (request, response) => {
    response.status(404).send({error:'unknown endpoint'})
}
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})