import React, {useState, useEffect, useRef} from 'react';
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/Login';
import Togglable from './components/Togglable';
import NoteForm from './components/NoteForm'

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
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

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



  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService.create(noteObject)
               .then(returnedNote => {
                 setNotes(notes.concat(returnedNote))
               })
  }

  const handleLogin = async (userObject) => {

    try{
      const user = await loginService.login(userObject)

      //store locally on browser
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      
    }catch(exception){
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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

  // const loginForm = () => {
  //   //an inline style rule, where the value of the display property is none if we do not want the component to be displayed
  //   const hideWhenVisible = {display: loginVisible ? 'none' : ''}
  //   const showWhenVisible = {display: loginVisible ? '' : 'none'}

  //   return (
  //     <div>
  //       <div style={hideWhenVisible}>
  //         <button onClick={() => setLoginVisible(true)}>log in</button>
  //       </div>
  //       <div style={showWhenVisible}>
  //         <LoginForm 
  //           username={username}
  //           password={password}
  //           handleUsernameChange={({target}) => setUsername(target.value)}
  //           handlePasswordChange={({target}) => setPassword(target.value)}
  //           handleSubmit={handleLogin}
  //         />
  //         <button onClick={()=>setLoginVisible(false)}>cancel</button>
  //       </div>
  //     </div>
  //   )
  // }

  const loginForm = () => {
    return(
      <Togglable buttonLabel='login'>
        <LoginForm handleLogin={handleLogin}/>
      </Togglable>
    )
  }

  // const noteForm = () => (
  //   <form onSubmit={addNote}>
  //         <input value={newNote} onChange={handleNoteChange} />
  //         <button type="submit">save</button>
  //   </form>
  // )

  const noteForm = () => {
    return (
      <Togglable buttonLabel='new note' ref={noteFormRef}>
        <NoteForm 
         createNote={addNote}
        />
      </Togglable>
    )
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.location.reload();
  }

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
          <button onClick={logout}>logout</button>
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