import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote} from '../reducers/anecdoteReducer'
import { messageChange } from '../reducers/messageReducer'


const AnecdoteList = () => {
    let anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    anecdotes = anecdotes.filter(a => a.content.toLowerCase().includes(filter))
    anecdotes.sort((a, b) => {
        return b.votes - a.votes
    })
    const dispatch = useDispatch()

    const vote = (id) => {
        console.log('vote', id)
        dispatch(voteAnecdote(id))
        const anecdote = anecdotes.find(a => a.id === id)
        
        dispatch(messageChange('you voted ' + anecdote.content, 5))
    }

    return(
        <div>
             <h2>Anecdotes</h2>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList