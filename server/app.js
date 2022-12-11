// importing libraries
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';

// importing error handlers
import { notFound, sendErrors } from './configs/errorHandlers.js';

// importing configs
import CONFIG from './configs/config.js';

// importing database and redis
import connectDB from './configs/dbConnection.js';
import { connectRedis } from './configs/redisConnection.js';

// importing routes
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import petRoute from './routes/pet.js';
import adoptionRoute from './routes/adoption.js';
import testRoute from './routes/test.js';

// importing socket server
import socketServer from './websocket/socketServer.js';

// app
const app = express();

// create server
const server = http.createServer(app);

// connect database
connectDB();

// connect redis
connectRedis();

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
app.use(`/${CONFIG.VERSION}/auth`, authRoute);
app.use(`/${CONFIG.VERSION}/user`, userRoute);
app.use(`/${CONFIG.VERSION}/pet`, petRoute);
app.use(`/${CONFIG.VERSION}/adoption`, adoptionRoute);
app.use(`/${CONFIG.VERSION}`, testRoute);

app.use('*', notFound);     // invalid route

// error handler
app.use(sendErrors);

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

// socket connection
socketServer(server);

// function to run server
function runServer() {
    try {
        // application server
        server.listen(CONFIG.PORT || 3000);
        console.info(`${CONFIG.NODE_ENV} server is up and running on PORT: ${CONFIG.PORT}`);
    } catch (err) {
        console.info('Error in running server!');
    }
}

export default () => { runServer() }
