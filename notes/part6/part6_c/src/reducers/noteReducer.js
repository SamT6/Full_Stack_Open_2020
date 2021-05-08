import noteService from '../services/notes'


// In practice, a reducer is a function which is given the current state and an action as parameters. It returns a new state.
const noteReducer = (state = [], action) => {
    switch(action.type){
        case 'NEW_NOTE':
            return state.concat(action.data) //OR using js array spread syntax [...state, action.data]
        case 'INIT_NOTES':
          return action.data
        case 'TOGGLE_IMPORTANCE': {
            const id = action.data.id
            const noteToChange = state.find(n => n.id === id)
            const changedNote = {
                ...noteToChange,
                important: !noteToChange.important
            }

            return state.map(note => 
                note.id !== id ? note : changedNote
            )
        }

        default:
            return state
    }
}

const generateId = () => 
    Number((Math.random() * 1000000).toFixed(0))


//asynchronous action creators
export const createNote = (content) => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote
    })
  }
}

//asynchronous action creators
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch({
      type: 'INIT_NOTES',
      data: notes
    })
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    data: { id }
  }
}

export default noteReducer