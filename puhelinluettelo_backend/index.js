const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const length = persons.length
    const currentDate = new Date();
    response.send(`<div>Phonebook has info for ${length} people <br> ${currentDate}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(persons => persons.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

  
app.post('/api/persons', (request, response) => {
    const body = request.body
    const randomID = Math.floor(Math.random() * 10000);

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    else if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
      }

    const person = {
        name: body.name,
        number: body.number,
        id: randomID,
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
