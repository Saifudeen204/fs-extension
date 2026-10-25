const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./server/controllers/blogs')
const usersRouter = require('./server/controllers/users')
const loginRouter = require('./server/controllers/login')

const app = express()

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./server/controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use('/api', middleware.unknownEndpoint)

app.get('/{*splat}', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(middleware.errorHandler)

module.exports = app
