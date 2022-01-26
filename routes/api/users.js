const express = require('express');
const { check,validationResult} = require('express-validator');
const router = express();

router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email','pleas enter valid email').isEmail(),
    check('password','password should be more than 6 char').isLength({min:6}),
], (req,res)=>{
    
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({error: error.array()});
    }
    console.log(req.body);
    res.send("User route");
})

module.exports = router;