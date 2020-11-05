import React, {useState} from 'react';
import ReactDOM from 'react-dom';


const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(6).fill(0));

  //anecdote that has the most vote
  const most_votes_anecdote = votes.indexOf(Math.max(...votes));

  let select_anecdote = () => {
    let random_number = Math.floor(Math.random() * 6); // 0 - 5
    console.log(random_number);
    setSelected(random_number);
  }

  let update_vote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    console.log(copy);
    setVotes(copy);
  }

  return(
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {votes[selected]} vote(s)</p>
      <br/>
      <button onClick={update_vote}>vote</button>
      <button onClick={select_anecdote}>next anecdote</button>

      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[most_votes_anecdote]}</p>
      <p>has {votes[most_votes_anecdote]} vote(s)</p>

    </div>
  );
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));