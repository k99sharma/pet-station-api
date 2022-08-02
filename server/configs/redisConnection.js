// importing modules
const redis = require('redis');

/**
 * function to create redis client.
 * @params { void }
 * @return { Object } return redis client.
 */

let client;

async function connectRedis(){
    client = redis.createClient();

    client.on('error', err => {
        console.log(err);
    });
    
    client.connect()
        .then(()=>{
            console.info('Redis connected!');
        })
        .catch(err => {
            console.info('Redis connection failed!');
            console.error(err);
        })
}

function getClient(){
    return client;
}

async function disconnectClient(){
    client.disconnect()
        .then(()=>{
            console.info('Redis disconnected!')
        })
        .catch(err => {
            console.log('Redis failed to disconnect!');
            console.log(err);
        })
}

module.exports = {
    connectRedis,
    getClient, 
    disconnectClient 
};