// App.js before separating backend service request into separate files

import React, {useState, useEffect} from 'react';
import Note from './components/Note'
import axios from 'axios';

//npx json-server --port 3001 --watch db.json


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  

   useEffect(() =>{
    console.log('effect');
    axios.get('http://localhost:3001/notes')
         .then(response => {
           console.log('promise fulfilled');
           setNotes(response.data);
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

    axios.post('http://localhost:3001/notes', noteObject)
         .then(response => {
           console.log(response);
           setNotes(notes.concat(response.data))
           setNewNote('')
         }); 
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = {
      ...note,
      important: !note.important
    }

    axios.put(url, changedNote)
         .then(response => {
            setNotes(notes.map(note => note.id !== id ? note : response.data))
         })

  }

  return(
    <div>
      <h1>Notes</h1>
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
    </div>
  );
}

export default App