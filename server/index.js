// importing libraries
import cluster from 'cluster'
import os from 'os'

// importing configs
import CONFIG from './configs/config.js'

// function to run server
import runServer from './app.js'

// if current process is master
if (cluster.isPrimary) {
    // if environment is production
    if (CONFIG.NODE_ENV === 'production') {
        // get total CPU cores count
        const cpuCount = os.cpus().length;

        // spawn a worker for every available core
        // eslint-disable-next-line no-plusplus
        for (let cpu = 0; cpu < cpuCount; cpu++)
            cluster.fork();
    } else {
        cluster.fork();
    }
} else {
    runServer();
}

// create new worker if any one is dead.
cluster.on('exit', worker => {
    console.warn(`Worker ${worker.id} died.`)
    console.log('Starting new worker!')

    // starting new worker.
    cluster.fork()
})