// importing libraries
import express from 'express';

const router = express.Router();

// test route
router.get('/test', (req, res) => res.send('Test route is working'))

export default router;