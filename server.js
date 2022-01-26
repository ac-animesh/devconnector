const express = require('express');
const connectDB = require('./config/db');

const app = express();

 connectDB();

const PORT = process.env.PORT ||'5000';

app.get('/' , (req,res)=>{
    res.send('Welcome Everyone');
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/post'));

app.listen(PORT, ()=>{
    console.log(`Server is connected on ${PORT}`)
})