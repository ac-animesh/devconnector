const express = require('express');
const router = express();

router.get('/', (req,res)=>{
    res.send("Auth route");
})

module.exports = router;