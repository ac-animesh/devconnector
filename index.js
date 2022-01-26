const express = require('express');

const app = express();

const PORT = '8000';

app.get('/' , (req,res)=>{
    res.send('Welcome Everyone');
})

app.listen(PORT, ()=>{
    console.log(`Server is connected on ${PORT}`)
})