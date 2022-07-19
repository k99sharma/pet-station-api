module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.NODE_ENV === 'production'
                ?
                process.env.MONGO_URI_PROD 
                : 
                process.env.MONGO_URI_DEV
}
