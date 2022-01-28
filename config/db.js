const mongoose = require('mongoose');
const config = require('./default.json');

const db = config.get('mongoURL');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewURLParser: true,
    });
    console.log('DB is connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
