import React from 'react';


const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
}
  
const Total = ({ course }) => {
    
    const total = course.parts.reduce(
      (sum, part) =>  sum + part.exercises
    , 0) //start with zero
  
    return(
      <h3>Number of exercises {total}</h3>
    ) 
}
  
const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
}
  
const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(
          (part, i) => <Part key={part.id} part={part} />
        )}
      </div>
    )
}
  
const Course = ({course}) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
}


export default Course