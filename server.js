'use strict'

const chalk = require('chalk')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const ws = require('socket.io')(server)
const pg = require('pg').native

const PORT = process.env.PORT || 3000

const POSTGRES_URL = process.env.POSTGRES_URL
  || 'postgres://localhost:5432/c11_node_psql_chat'

const db = new pg.Client(POSTGRES_URL)

app.set('view engine', 'jade')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

// app.get('/chats', (req, res) => {
//   db.query('SELECT * FROM chats', (err, result) => {
//     if (err) throw err

//     res.send(result.rows)
//   })
// })

db.connect((err) => {
  if (err) throw err;

  server.listen(PORT, () => {
    console.log(chalk.bold.black.bgWhite(`*******  Server listening on PORT: ${PORT}  ******`))
  })

})

// connection event
ws.on('connection', socket => {
  console.log(chalk.bold.blue.bgYellow('*********  Back-End Socket Connected  *********'), socket.id)

  db.query('SELECT * FROM chats', (err, result) => {
    if (err) throw err

    socket.emit('receiveChat', result.rows)
  })

  // when server hears the emit event (sendChat in main.js)
  // it listens and waits for callback to re-submit it back to browser
  socket.on('sendChat', msg => {
    db.query('INSERT INTO chats (name, text) VALUES ($1, $2)',
      [msg.name, msg.text], (err) => {
        if (err) throw err;

        socket.broadcast.emit('receiveChat', [msg])
    })
  })

})


// started out using native node to create server
// added express after and passed into socket

// 'use strict'

// const server = require('http').createServer()
// const io = require('socket.io')(server)

// const PORT = process.env.PORT || 3000

// server.listen(PORT, () => {
//   console.log(`server listening on PORT: ${PORT}`)
// })


// browser talking to the server through the socket
// interfacing w/ ws module, ws server
// front-end and back-end interaction
// ^^^ bower install socket.io (front-end) npm install socket.io (back-end) ^^^
