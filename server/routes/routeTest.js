// importing modules
const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.status(200).end('Routes are working');
});

module.exports = router;