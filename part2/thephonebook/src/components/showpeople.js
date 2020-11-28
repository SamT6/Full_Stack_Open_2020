import React from 'react'

const ShowPeople = (props) => {
    
    let searchWord = props.searchWord
    let persons = props.persons
    let searchPersons = props.searchPersons

    return(
        <ul>
            {searchWord === '' ? 
                persons.map((person)=> {
                    return(
                        <div key={person.name}>
                            <li key={person.name}>{person.name} {person.number}</li>
                            <button onClick={() => {props.onButtonClick(person)}}>delete</button>
                        </div> 
                    )
                })
                :
                searchPersons.map((person)=> {
                    return(
                        <div key={person.name}>
                            <li key={person.name}>{person.name} {person.number}</li>
                            <button onClick={() => {props.onButtonClick(person)}}>delete</button>
                        </div>
                    )
                })
            }
        </ul>
    )
}

export default ShowPeople
