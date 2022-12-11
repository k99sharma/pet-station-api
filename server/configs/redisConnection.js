// importing libraries
import redis from 'redis';

// importing configs
import CONFIG from './config.js';

let client     // global variable

// function to create redis connection
export function connectRedis() {
    if (CONFIG.NODE_ENV === 'production') {
        client = redis.createClient({
            url: CONFIG.REDIS_URL
        });
    } else {
        client = redis.createClient();
    }

    client.on('error', (err) => {
        console.error(err);
    })

    client
        .connect()
        .then(() => {
            console.info('Redis connected.');
        })
        .catch(err => {
            console.info('Redis connection failed.');
            console.error(err);
        })
}

// function to get redis client
export function getRedisClient() {
    return client;
}

// function to disconnect client
export function disconnectRedisClient() {
    client
        .disconnect()
        .then(() => {
            console.log('Redis disconnected.');
        })
        .catch(err => {
            console.log('Redis failed to disconnect.');
            console.error(err);
        })
}
