const express = require('express')
const cors = require('cors')


const app = express()
app.use(cors())

app.use(express.static('dist'))

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)



app.get('/', (req, res) => {
    /* Since the parameter is a string, Express automatically sets 
    the value of the Content-Type header to be text/html. The status code of 
    the response defaults to 200. */
    res.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res)=>{
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    /* The if-condition leverages the fact that all JavaScript objects are truthy, 
    meaning that they evaluate to true in a comparison operation. However, undefined 
    is falsy meaning that it will evaluate to false. */
    if (note) {
        res.json(note)
    } else {
        res.status(404).end('Invalid')
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes= notes.filter(note => note.id !== id)

    res.status(204).end('deleted')
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

/* Without the json-parser, the body property would be undefined.
 The json-parser takes the JSON data of a request, transforms it into a JavaScript object
  and then attaches it to the body property of the request object before the route handler is called.*/
app.post('/api/notes', (req, res) => {
    const body = req.body 
    // console.log(note);

    if (!body.content){
        return res.status(400).json({
            error: 'content-missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes= notes.concat(note)
    
    res.json(note)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})