const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const app = express()

dotenv.config()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const todosRouter = require('./routes/todos/todos.js')
const authRouter = require('./routes/auth/auth.js')

app.use('/routes/todos', todosRouter)
app.use('/register', authRouter)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
