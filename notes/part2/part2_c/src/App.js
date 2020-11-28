import React, {useState, useEffect} from 'react';
import Note from './components/Note'
import axios from 'axios';

//npx json-server --port 3001 --watch db.json


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  

  const hook = () =>{
    console.log('effect');
    axios.get('http://localhost:3001/notes')
         .then(response => {
           console.log('promise fulfilled');
           setNotes(response.data);
         })
  }

  // By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.
  //second parameter is the variable the hook depends on, if the second paremters changes then useEffect is run 
  useEffect(hook, [])

  console.log('render', notesToShow.length, 'notes');


  const addNote = (event) => {
    event.preventDefault() // prevent page reload 
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5, //random true or false 
      id: notes.length + 1
    }

    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
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
          <Note key={note.id} note={note}/> //notice the key attribute must now be defined here
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