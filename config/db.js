const mongoose = require('mongoose');

const db = 'mongodb+srv://animesh123:animesh123@devconnector.4aduw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const connectDB = async()=>{
    try{
      await mongoose.connect(db);
        console.log("DB is connected...");
    } catch(err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;