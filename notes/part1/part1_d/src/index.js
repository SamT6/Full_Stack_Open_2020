import React, {useState} from 'react';
import ReactDOM from 'react-dom';

/* note: 
== in JavaScript is used for comparing two variables, but it ignores the datatype of variable. 
=== is used for comparing two variables, but this operator also checks datatype and compares two values.
*/

/*
The useState function (as well as the useEffect function introduced later on in the course)
 must not be called from inside of a loop, a conditional expression, or any place that is not a function defining a component. 
 This must be done to ensure that the hooks are always called in the same order, 
 and if this isn't the case the application will behave erratically.
*/

const History = (props) => {
  if(props.allClicks.length === 0){
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    );
  }

  return(
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)


const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  // debugger; //use to stop
  const handleLeftClick = () => {
    setAll(allClicks.concat('L')) // concat returns a new copy of modified array
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  // function that returns a function
  // a factory that produces customized event handlers 
  const hello = (who) => {
    return () => console.log('hello', who);
  }
  //an alternative way to do this
  const hi = (who) => {
    return console.log('hi', who);
  }


  /*event handlers like onClick receive a reference to a function as parameter,
    not a function call, variable, or assignment
  */
  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text='left'/>
      <Button onClick={handleRightClick} text='right'/>
      {right}
      <History allClicks={allClicks}/>
      
      <button onClick={hello('world')}>world</button>
      <button onClick={hello('react')}>react</button>
      <button onClick={() => hi('function')}>function</button>

    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));