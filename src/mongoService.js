import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// function getMongoInstance(url) {
//   const client = new MongoClient(url);
//   return client;
// }

// async function getNodeRedFlowJson() {
//   try {
//     let mongoInstance = await getMongoInstance().connect();
//     console.log('Connected to MongoDB');
//     const databaseFlowNodeRed = getMongoInstance().db('flow_node_red').command({ ping: 1 });
//     // const flow = await databaseFlowNodeRed.collection('flowJSON').
//     // const flow = await databaseFlowNodeRed.collection('flowJSON').find().sort({ dateField: -1 }).limit(1).findOne()
//   } catch (error) {
//     console.error('Error connecting to MongoDB', error);
//   }
// }
// module.exports = getMongoInstance

export class DatabaseService {
  constructor(urlDatabase, databaseName, collectionName) {
    this.client = new MongoClient(urlDatabase);
    this.database = this.client.db(databaseName);
    this.collectionName = collectionName;
  }

  async connect() {
    try {
      await this.database.command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      throw error;
    }
  }

  get flowCollection() {
    return this.database.collection(this.collectionName);
  }
}

// get users(): Collection<User> {
//   return this.db.collection(process.env.DB_COLLECTION_USERS as string)
// }

// // optimize database
// async indexUsers() {
//   const isExisted = await this.users.indexExists(['email_1', 'username_1', 'email_1_password_1'])
//   if (isExisted) return
//   await this.users.createIndex({ email: 1 }, { unique: true }) //register
//   await this.users.createIndex({ username: 1 }, { unique: true }) //getProfile
//   await this.users.createIndex({ email: 1, password: 1 }) //login
// }

// const databaseService = new DatabaseService();
// export default databaseService;
