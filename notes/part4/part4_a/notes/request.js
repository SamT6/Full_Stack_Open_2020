const express = require('express')
const app = express()

app.use(express.json())

app.post('/api/notes', (request, response) => {
    
    const note = request.body  // Without the json-parser, the body property would be undefined
    console.log(note)
    console.log(request.get('Content-Type'));
    console.log(request.headers)

    notes = notes.concat(note)
    response.json(note)
})