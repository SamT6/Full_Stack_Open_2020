import React from 'react'
import { connect } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({note, handleClick}) => {
    return (
        <li onClick={handleClick}>
            {note.content}
            <strong>{note.important ? 'important' : ''}</strong>
        </li>
    )
}

const Notes = (props) => {    
    return (
        <ul>
            {props.notes.map(note => 
                <Note 
                    key={note.id}
                    note={note}
                    handleClick={() => {
                        props.toggleImportanceOf(note.id)
                    }}
                />
            )}
        </ul>
    )
}

//The connect function accepts a so-called mapStateToProps function as its first parameter. The function can be used for defining the props of the connected component that are based on the state of the Redux store.
const mapStateToProps = (state) => {
    if(state.filter === 'ALL'){
        return {
            notes: state.notes
        }
    }

    return {
        notes: (state.filter === 'IMPORTANT'
                ? state.notes.filter(note => note.important)
                : state.notes.filter(note => !note.important)
        )
    }   
}

//The second parameter of the connect function can be used for defining mapDispatchToProps which is a group of action creator functions passed to the connected component as props.
const mapDispatchToProps = {
    toggleImportanceOf
}


//use the connect function to transform our Notes component into a connected component
const ConnectedNotes = connect(mapStateToProps, mapDispatchToProps)(Notes)

export default ConnectedNotes