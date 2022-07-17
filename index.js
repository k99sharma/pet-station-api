// importing modules
const cluster = require('cluster');
const os = require('os');
const runServer = require('./app');

// condition to check if current process is master.
if(cluster.isMaster){
    
    // condition to check if current environment is production or not.
    if(process.env.NODE_ENV === 'production'){
        
        // get total CPU cores count.
        const cpuCount = os.cpus().length;

        // spawn a worker for every available core.
        for(let cpu=0; cpu < cpuCount; cpu++){
            cluster.fork();
        }
    }else{
        cluster.fork();
    }
}else{

    // run server.
    runServer();
}

// create new worker if any one is dead.
cluster.on('exit', function(worker){
    console.warn(`Worker ${worker.id} died.`);
    console.log('Starting new worker!');
    
    // starting new worker.
    cluster.fork();
})