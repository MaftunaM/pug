const express = require('express')
const app = express()
const morgan = require('morgan')
// const helmet = require('helmet')
const path = require('path')

// Require routes
const homeRouter = require('./routes/home')
const lessonRouter = require('./routes/lesson')

// Pug connection
app.set('view engine', 'pug')

// Dotenv
require('dotenv').config()

// Middleware functions
app.use(express.json())

// Express static middleware
app.use(express.static(path.join(__dirname, 'public')))

// Urlencoded middleware
app.use(express.urlencoded({ extended: true }))

// Module middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'))
}

// app.use(helmet())

// Routing
app.use('/', homeRouter)
app.use('/api/lessons/', lessonRouter)

const port = normalizePort(process.env.port || 3000) // Number

app.listen(port, () => {
    console.log('App listening on port ' + port);
})

function normalizePort(val) { // number // string // false
    const num = parseInt(val)
    if (isNaN(num)) {
        return val
    }

    if (num) {
        return num
    }

    return false
}