import express from 'express';
import http from 'http';
import nodeRedApp from 'node-red';
import dotenv from 'dotenv';
import cors from 'cors';
import { DatabaseService } from './mongoService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT_SERVER = process.env.PORT_SERVER || 4000;
// environment
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = isProduction ? process.env.PRODUCTION_FRONTEND_URL : process.env.DEVELOPMENT_FRONTEND_URL;
const databaseURL = isProduction ? process.env.PRODUCTION_DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL;
const databaseName = process.env.DATABASE_NAME;
const databaseCollection = process.env.DATABASE_COLLECTION;
// cors
const corsOptions = {
  origin: frontendURL,
  credentials: true, // access-control-allow-credentials:true
  allowedHeaders: ['Content-Type', 'Authorization'], // access-control-allow-headers
  optionSuccessStatus: 200,
};

// Create an Express app
var app = express();
app.use(cors(corsOptions));

// Create a server
var server = http.createServer(app);

// Main
(async () => {
  // Get Flow from MongoDB
  const databaseService = new DatabaseService(databaseURL, databaseName, databaseCollection);
  await databaseService.connect();
  const flowFile = JSON.parse(fs.readFileSync(new URL('./flows.json', import.meta.url), 'utf8'));
  console.log(flowFile);
  await databaseService.flowCollection.insertOne({ flow: flowFile, dateLog: new Date().toISOString() });
  console.log('Inserted flowFile to MongoDB');
})();

// var flowFile = getMongoInstance(databaseURL)
//   .db('flow_node_red')
//   .collection('flowJSON')
//   .find()
//   .sort({ dateField: -1 })
//   .limit(1);
