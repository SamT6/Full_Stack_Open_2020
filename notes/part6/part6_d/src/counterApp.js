import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux';

// a reducer is a function which is given the current state and an action as parameters. It returns a new state.
const counterReducer = (state=0, action) => {
  switch (action.type){
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default: // if none of the above matches, code comes here
    return state 
  }
}

const store = createStore(counterReducer)


const App = () => {
  return (
    <div>
     <div>
       {store.getState()}
     </div>
     <button
      onClick={e => store.dispatch({type:'INCREMENT'})}
     >
       plus
     </button>
     <button
      onClick={e => store.dispatch({type:'DECREMENT'})}
     >
       minus
     </button>
     <button
      onClick={e => store.dispatch({type:'ZERO'})}
     >
       zero
     </button>
    </div>
  );
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)