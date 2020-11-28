import React, {useState, useEffect} from 'react';
import Note from './components/Note'
import noteService from './services/notes'

//npx json-server --port 3001 --watch db.json

const Notification = ({message}) => {
  if(message === null){
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return(
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  

   useEffect(() =>{
    noteService.getAll()
               .then(initialNotes => {
                 setNotes(initialNotes)
               })
  }, [])

  console.log('render', notesToShow.length, 'notes');


  const addNote = (event) => {
    event.preventDefault() // prevent page reload 
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5, //random true or false 
    }

    noteService.create(noteObject)
               .then(returnedNote => {
                 setNotes(notes.concat(returnedNote))
                 setNewNote('')
               })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {
      ...note,
      important: !note.important
    }

    noteService.update(id, changedNote)
               .then(returnedNote => {
                 setNotes(notes.map(note => note.id !== id ? note : returnedNote))
               })
               .catch(error => {
                 //alert(`the note '${note.content}' was already deleted from server`)
                 setErrorMessage(
                   `Note '${note.content}' was already removed from server`
                 )
                 setTimeout(() => {
                   setErrorMessage(null)
                 }, 5000)
                 setNotes(notes.filter(n => n.id !== id))
               })
  }

  return(
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={()=> setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} 
          toggleImportance={()=> toggleImportanceOf(note.id)}/> //notice the key attribute must now be defined here
        )}
      </ul>

      <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange} />
          <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App