import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Button = (props) => {
  return(
    <div>
      <button onClick={props.handleClick}>{props.text}</button>
    </div>
  )
} 

const Statistic = (props) => {
  return(
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  )
}

const Statistics = (props) => {
  if(props.good !==0 || props.bad !==0 || props.neutral !== 0){
    return(
      <div>
        <table>
          <tbody>
            <Statistic text="Good" value={props.stat.good}/>
            <Statistic text="Neutral" value={props.stat.neutral}/>
            <Statistic text="Bad" value={props.stat.bad}/>
            <Statistic text="Total" value={props.stat.total}/>
            <Statistic text="Average" value={props.stat.average}/>
            <Statistic text="Percent Positive" value={props.stat.percent_positive + '%'}/>
          </tbody>
        </table>
      </div>
    );
  }

  return(
    <div>
      <p>No feedback yet!</p>
    </div>
  );
 
}

const App = () => {
  //save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  let stat = {
    good: good,
    bad: bad,
    neutral: neutral,
    total: good + neutral + bad,
    average: (good - bad) / 3,
    percent_positive: good / (good + neutral + bad) || 0,
  }

  return(
    <div>
      <h1>Please provide your feedback!</h1>
      <Button handleClick={()=>{setGood(good+1)}} text="Good" />
      <Button handleClick={()=>{setNeutral(neutral+1)}} text="Neutral" />
      <Button handleClick={()=>{setBad(bad+1)}} text="Bad" />

      <h1>Statistics</h1>
      <Statistics stat={stat} />

    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));


