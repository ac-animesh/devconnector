const express = require('express');
const router = express();

router.get('/', (req,res)=>{
    res.send("User route");
})

module.exports = router;