const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')


app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/logout', logoutRouter)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'Malformatted id' })
    }
    if (error.message === 'Blog not found') {
        return response.status(404).json({ error: 'Blog not found' })
    }
    if (error.message === 'Server Error') {
        return response.status(500).json({ error: 'Server Error' })
    }
    if (error.name === 'SequelizeValidationError') {
        return response.status(400).json({ error: 'Validation isEmail on username failed' })
    }
    if (error.name === 'PermissionError') {
        return response.status(400).json({ error: 'User has no permission for this operation' })
    }
    next(error);
}

app.use(errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()