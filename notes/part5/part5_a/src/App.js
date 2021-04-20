import React, {useState, useEffect} from 'react';
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'

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
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  

  useEffect(() =>{
    noteService.getAll()
               .then(initialNotes => {
                 setNotes(initialNotes)
               })
  }, [])


  //check local storage for user info
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])



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

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username, password,
      })

      //store locally on browser
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }catch(exception){
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name="Username"
            onChange={({target}) => setUsername(target.value)} //The event handlers are simple: An object is given to them as a parameter, and they destructure the field target from the object and save its value to the state.
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange} />
          <button type="submit">save</button>
    </form>
  )

  return(
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      {
        user === null ? 
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
        // OR 
        //{user === null && loginForm()}
        //{user !== null && noteForm()}
      }

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

      
      <Footer />
    </div>
  );
}

export default App