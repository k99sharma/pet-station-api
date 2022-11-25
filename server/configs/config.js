// importing libraries
import dotenv from 'dotenv';

// configuring environment variables
dotenv.config();

const CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION,
    PORT: process.env.PORT,
    MONGO_URI:
        process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI_PROD
            : process.env.MONGO_URI_DEV,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY
}

export default CONFIG;

