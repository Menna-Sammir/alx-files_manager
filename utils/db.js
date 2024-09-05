const { MongoClient } = require('mongodb');

const sha1 = require('sha1');
// eslint-disable-next-line no-unused-vars
// import Collection from 'mongodb/lib/collection';
// import envLoader from './env_loader';

/**
 * Represents a MongoDB client.
 */
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
class DBClient {
  constructor() {
    const url = `mongodb://${DB_HOST}:${DB_PORT}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        console.log('Successfully connected to the database');
        this.db = this.client.db(DB_DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      })
      .catch((err) => {
        console.log('Error Connecting to the database', err.message);
      });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    // eslint-disable-next-line no-return-await
    return await this.users.countDocuments();
  }

  async nbFiles() {
    // eslint-disable-next-line no-return-await
    return await this.files.countDocuments();
  }

  async addUser(user) {
    let newUser = await this.users.findOne({ email: user.email });
    if (newUser) return null;
    newUser = { ...user };
    newUser.password = sha1(user.password);
    newUser = await this.users.insertOne(newUser);
    return newUser;
  }

  // eslint-disable-next-line consistent-return
  async addFile(file) {
    const newFile = await this.files.insertOne(file);
    return newFile.insertedId;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
