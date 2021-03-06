import mongoose from 'mongoose';
import bluebird from 'bluebird';

const connectDB = () => {
  mongoose.Promise = bluebird;

  let uri = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
};

module.exports = connectDB;