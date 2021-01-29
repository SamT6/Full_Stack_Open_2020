import React, {useState, useEffect} from 'react'
import Search from './components/search'
import Form from './components/form'
import ShowPeople from './components/showpeople'
import personService from './services/persons'

const Notification = ({message}) => {
    if(message === null){
      return null
    }
    
    const messageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return (
      <div style={messageStyle}>
        {message}
      </div>
    )
}

const ErrorMessage = ({message}) => {
    if(message === null){
      return null
    }
    
    const messageStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return (
      <div style={messageStyle}>
        {message}
      </div>
    )
}


const App = () => {
    const [persons, setPersons] = useState([])
    const [newPerson, setNewPerson] = useState({
        name: '', number: ''
    })
    const [searchPersons, setSearchPersons] = useState([])
    const [searchWord, setNewSearchWord] = useState('')
    const [notifyMessage, setNotifyMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    
    //fetch data at the beginning 
    useEffect(()=>{
        console.log('fetching data...');
        personService.getAll()
                     .then(people => {
                         setPersons(people)
                     })
    }, []);

    
    const addPerson = (event) => {
        event.preventDefault()
        console.log('submitted');

        if(persons.find(person => person['name'] === newPerson['name'])){ // check if person exist already
            //window.alert(`${newPerson['name']} is already added to phonebook`) // template string with backticks `` (upper left on keyboard)
            const updatedPerson = {
                ...newPerson,
                id: persons.find(person => person['name'] === newPerson['name']).id
            }

            if(window.confirm(`${updatedPerson.name} is already added to phonebook, replace the old number with a  new one?`)){
                personService.updateNumber(updatedPerson)
                             .then(up => {
                                console.log(up);
                                setPersons(persons.map(p => p.id !== up.id ? p : up))
                                setNotifyMessage(`Updated ${updatedPerson.name}'s phone number`)
                                setTimeout(() => {
                                    setNotifyMessage(null)
                                }, 5000)
                             })
                             .catch(error => {
                                setErrorMessage(`Information of ${updatedPerson.name} has already been removed from server`)
                                setTimeout(() => {
                                    setErrorMessage(null)
                                }, 5000)
                                setPersons(persons.filter(p => p.id !== updatedPerson.id))
                             })
            }
        }
        else{ //person not in array
            personService.create(newPerson)
                         .then( person => {
                             setPersons(persons.concat(person))
                             setNotifyMessage(`Added ${newPerson.name}`)
                                setTimeout(() => {
                                    setNotifyMessage(null)
                                }, 5000)
                         })
                         .catch(error => {
                             console.log(error.response.data);
                             setErrorMessage(error.response.data)
                         })
                         
        }
        
        setNewPerson({name: '', number: ''})
    }

    const handlePersonChange = (event) => {
        setNewPerson({
            ...newPerson,
            name: event.target.value
        })
    }

    const handleNumberChange = (event) => {
        setNewPerson({
            ...newPerson,
            number: event.target.value
        })
    }


    const handleSearch = (event) => {
        let search = event.target.value
        setNewSearchWord(search)
        //put search result in searchPersons array
        setSearchPersons(persons.filter(
            (person) => person['name'].toLowerCase().includes(search.toLowerCase())  
        ))        
    }

    const handleDelete = (person) => {
        //use window.confirm
        if(window.confirm(`Delete ${person.name}?`)){
            console.log('deleting id: ', person.id);
            personService.deletePerson(person.id)
                         .then(() => {
                            console.log('deleted ', person.name)
                            setPersons(persons.filter(p => p.id !== person.id))
                         })
                         .catch(error => {
                            setErrorMessage(`Information of ${person.name} has already been removed from server`)
                            setTimeout(() => {
                                setErrorMessage(null)
                            }, 5000)
                            setPersons(persons.filter(p => p.id !== person.id))
                         })
                         
        }
    }

    return(
        <div>
            <h2>Phonebook</h2>
            <Notification message={notifyMessage}/>
            <ErrorMessage message={errorMessage}/>
            <Search value={searchWord} onChange={handleSearch} />
    
            <h2>add a new</h2>
            <Form onSubmit={addPerson} name_value={newPerson['name']} name_onChange={handlePersonChange} 
                number_value={newPerson['number']} number_onChange={handleNumberChange}
            />
    
            <h2>Numbers</h2>
            <ShowPeople searchWord={searchWord} persons={persons} searchPersons={searchPersons} onButtonClick={handleDelete}/>
        </div>
    )
}

export default App