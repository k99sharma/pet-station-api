// importing libraries
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// importing configs
import CONFIG from './configs/config.js';

// configuring environment variables
dotenv.config();

// app
const app = express();

// configuring DB

// configuring Redis

// configuring middleware
app.use(morgan('combined'));      // morgan
app.use(compression());     // compression
app.use(helmet());      // helmet
app.use(cors({ exposedHeaders: 'x-auth-token' }));      // cors

// urlencoded parsing
app.use(express.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}));

// setting up production console errors
if (CONFIG.NODE_ENV === 'production') {
    console.log = () => { }
    console.warn = () => { }
    console.error = () => { }
}

// configuring routes

// allowing headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    next();
});

// function to run server
function runServer() {
    try {
        app.listen(CONFIG.PORT || 3000);
        console.info(`${CONFIG.NODE_ENV} server is up and running on PORT: ${CONFIG.PORT}`);
    } catch (err) {
        console.info('Error in running server!');
    }
}

export default () => { runServer() }
