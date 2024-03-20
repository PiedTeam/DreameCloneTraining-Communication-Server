const { MongoClient } = require('mongodb')

import dotenv from 'dotenv'
dotenv.config()

function getMongoInstance() {
  const uri = process.env.MONGO_URI
  console.log('uri', uri)
  const client = new MongoClient(uri)
  return client
}

async function getNodeRedFlowJson() {
  try {
    await getMongoInstance().connect()
    console.log('Connected to MongoDB')
    const databaseFlowNodeRed = getMongoInstance().db('flowNodeRed').command({ ping: 1 })
    // const flow = await databaseFlowNodeRed.collection('flowJSON').
    // const flow = await databaseFlowNodeRed.collection('flowJSON').find().sort({ dateField: -1 }).limit(1).findOne()
  } catch (error) {
    console.error('Error connecting to MongoDB', error)
  }
}

// module.exports = getMongoInstance
