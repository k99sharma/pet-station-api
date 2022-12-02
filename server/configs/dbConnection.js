// importing libraries
import mongoose from 'mongoose';

// import configs
import CONFIG from './config.js';

// set mongoose to debug in development environment
if (CONFIG.NODE_ENV === 'development')
    mongoose.set('debug', true);

// function to connect mongoDB database
function connectDB() {
    try {
        mongoose.connect(CONFIG.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Database connection Error: '));
        db.once('open', () => {
            console.log('Database connection is successful!');
        });
    }
    catch (err) {
        console.error(err);
    }
}

export default connectDB;