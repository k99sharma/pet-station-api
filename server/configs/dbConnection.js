// import modules
const mongoose = require('mongoose')

// import environment variables
const { NODE_ENV, MONGO_URI } = require('./index')

// set mongoose to debug in development environment
if (NODE_ENV === 'development') mongoose.set('debug', true)

/**
 * function to connect mongoDB database
 *
 * @param { void }
 *
 * @return { void }
 */

function connectDatabase() {
    try {
        // connect using MONGO URI
        mongoose
            .connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log('MongoDB is connected!')
            })
    } catch (err) {
        console.error(err)
    }
}

// call connection function
connectDatabase()
