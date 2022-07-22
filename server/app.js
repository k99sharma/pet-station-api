// import modules
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

// configuring environment variables
require('dotenv').config()

// importing configurations
const { NODE_ENV, PORT } = require('./configs/index')

// importing error handlers
const { notFound, sendErrors } = require('./configs/errorHandlers');

// app
const app = express()

// configuring database connection
require('./configs/dbConnection');

// setting up middleware
app.use(compression()) // compression middleware
app.use(morgan('dev')) // morgan middleware
app.use(helmet()) // helmet middleware

// cors
app.use(cors({ exposedHeaders: 'x-auth-token' }))

// urlencoded parsing
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 1000000,
    })
)

// json parsing
app.use(
    express.json({
        limit: '50mb',
        extended: true,
        parameterLimit: 1000000,
    })
)

// setting up production console errors
if (NODE_ENV === 'production')
    console.log = console.warn = console.error = () => {}

// setting up routes

app.use('*', notFound)      // route not found

// error handlers
app.use(sendErrors)

// allowing headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')

    next();
})

/**
 * function to create server.
 *
 * @param { void }
 * @return { void }
 */
function runServer() {
    try {
        app.listen(PORT || 3000);
        console.info(`${NODE_ENV} server is up and running on PORT: ${PORT}.`);
    } catch (err) {
        console.info('Error in running server.');
    }
}

// exporting functions
module.exports = () => {
    runServer();
}
