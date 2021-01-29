require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors') // allow requests from different origins
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())


morgan.token('post-request-data', function (req, res) { 
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-request-data'))


let notes = [
    {
        id: 1,
        name: "Arto Hellas",
        number:"040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number:"39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number:"12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number:"39-23-6423122"
    },
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(people => {
        response.send(`
    <p>Phonebook has info for ${people.length} people</p>
    <p>${new Date()}</p>
    `)
    })
})

app.get('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // const note = notes.find(note => note.id === id)

    // if(note){ // if note exists
    //     response.json(note)
    // }
    // else{
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
          .then(person => {
              if(person){
                response.json(person)
              }
              else{
                  response.status(404).end()
              }
          })
          .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // notes = notes.filter(note => note.id !== id)
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
          .then(result => {
              response.status(204).end()
          })
          .catch(error => next(error))
})

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body 

    if(!body.name){// if missing
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if(notes.find(note => note.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    //const current_maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    const new_person = Person({
        name: body.name,
        number: body.number,
    })

    // notes = notes.concat(new_note)
    // console.log(notes);
    // response.json(new_note)
    new_person.save().then(saved => {
        response.json(saved)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    // !! a javascript object NOT a Person Mongoose object
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
          .then(updatedPerson => {
              response.json(updatedPerson)
          })
          .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if(error.name === 'CastError'){
        return response.status(400).send({error: "malformatted id"})
    }
    else if(error.name === "ValidationError"){
        return response.status(400).send({error: "no duplicate names!"})
    }

    next(error) 
}
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
