const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
    await Note.deleteMany({})

    //The problem is that every iteration of the forEach loop generates its own asynchronous operation, and beforeEach won't wait for them to finish executing.
    //Since the execution of tests begins immediately after beforeEach has finished executing, the execution of tests begins before the database state is initialized.
//   helper.initialNotes.forEach(async (note) => {
//       let noteObject = new Note(note)
//       await noteObject.save()
//   })

    const noteObjects = helper.initialNotes.map(note => new Note(note))
    // an array that consists of promises
    const promiseArray = noteObjects.map(note => note.save())
    //The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises.
    //The Promise.all method can be used for transforming an array of promises into a single promise, that will be fulfilled once every promise in the array passed to it as a parameter is resolved. 
    //Promise.all executes the promises it receives in parallel!
    await Promise.all(promiseArray)

    //if need a specific execution order.
    /*
    for (let note of helper.initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
    */
})

describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api.get('/api/notes')
                 .expect(200)
                 .expect('Content-Type', /application\/json/)
    })
    
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')
      
        // execution gets here only after the HTTP request is complete
        // the result of HTTP request is saved in variable response
        expect(response.body).toHaveLength(helper.initialNotes.length)
    })
      
    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')
      
        const contents = response.body.map(r => r.content)
        expect(contents).toContain(
            'Browser can execute only Javascript'
        )
    })
})

describe('viewing a specific note', () => {
    test('a valid note can be added', async () => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }
    
        await api.post('/api/notes')
                 .send(newNote)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)
    
    
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
    
        const contents = notesAtEnd.map(n => n.content)
        expect(contents).toContain('async/await simplifies making async calls')
    })
    
    test('note without content is not added', async () => {
        const newNote = {
            important: true
        }
    
        await api.post('/api/notes')
                 .send(newNote)
                 .expect(400)
    
        const notesAtEnd = await helper.notesInDb()
    
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
    
    test('a specific note can be viewed', async () => {
        const notesAtStart = await helper.notesInDb()
      
        const noteToView = notesAtStart[0]
      
        //the note object we receive as the response body goes through JSON serialization and parsing
        const resultNote = await api
          .get(`/api/notes/${noteToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        //that's why we can't directly compare equality of the resultNote.body and noteToView. Instead, we must first perform similar JSON serialization and parsing for the noteToView
        const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
      
        expect(resultNote.body).toEqual(processedNoteToView)
    })
      
    test('a note can be deleted', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]
      
        await api
          .delete(`/api/notes/${noteToDelete.id}`)
          .expect(204)
      
        const notesAtEnd = await helper.notesInDb()
      
        expect(notesAtEnd).toHaveLength(
          helper.initialNotes.length - 1
        )
      
        const contents = notesAtEnd.map(r => r.content)
      
        expect(contents).not.toContain(noteToDelete.content)
    })
})


afterAll(() => {
    mongoose.connection.close()
})