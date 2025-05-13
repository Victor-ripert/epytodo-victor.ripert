const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const db = require('./config/db');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

const todosRouter = require('./routes/todos/todos.js');
const authRouter = require('./routes/auth/auth.js');
const userRouter = require('./routes/user/user.js');
const authmiddleware = require('./middleware/auth.js')

app.use('/register', authRouter);

app.use(authmiddleware);

app.use('/todos', todosRouter);
app.use('/user', userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
})