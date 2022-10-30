module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI:
        process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI_PROD
            : process.env.MONGO_URI_DEV,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    ENCRYPT_KEY: process.env.ENCRYPT_KEY,
    REDIS_URL: process.env.REDIS_URL,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
}
