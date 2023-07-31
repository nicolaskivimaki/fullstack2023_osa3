import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'

const DisplayPerson = ({person, deletePerson}) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={deletePerson}>delete</button>
    </div>
  )
}

const Persons = ({persons, deleteContact}) => {
  return (
    <div>
      {persons.map(person => 
          <DisplayPerson key = {person.name} person={person} deletePerson={() => deleteContact(person)} />
        )}
    </div>
  )
}

const Filter = (props) => {
  return (
    <form>
        filter shown with <input 
            value={props.nameSearch}
            onChange={props.eventHandler}
            />
      </form>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.action}>
        <div>
          name: <input 
          value={props.newName}
          onChange={props.handleNameChange}
          />
          <br/>
          number: <input 
          value={props.newNumber}
          onChange={props.handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const deleteContact = (person) => {
    if (window.confirm(`Do you want to delete ${person.name} from the phonebook?`))
    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(n => n.id !== person.id))
        setErrorMessage({
          message: `Removed ${person.name}`,
          color: 'green'
        }
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'notes')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNameSearch = (event) => {
    console.log(event.target.value)
    setNameSearch(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const namesList = persons.map(person => person.name)
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    if (namesList.includes(newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)) {
        const person = persons.find(n => n.name === newName)
        const changedContact = { ...person, number: newNumber }
        personService
          .update(person.id, changedContact)
          .then(returnedContact => {
            setPersons(persons.map(person => person.name !== newName ? person : returnedContact))
            setNewName('')
            setNewNumber('')
            setErrorMessage({
              message: `Replaced number for ${newName}`,
              color: 'green'
            })
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage({
              message: `Information of ${newName} has already been removed from server`,
              color: 'red'
            })
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id !== person.id))
          })
          
      }
    } else {
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setErrorMessage({
            message: `Added ${newName}`,
            color: 'green'
          })
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }}
    
  

  const personsToShow = persons.filter(person => person.name.includes(nameSearch))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} />

      < Filter nameSearch={nameSearch} eventHandler={handleNameSearch} />

      <h3>Add a new</h3>

      < PersonForm action={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      < Persons persons={personsToShow} deleteContact= {deleteContact}/>

    </div>
  )

}

export default App