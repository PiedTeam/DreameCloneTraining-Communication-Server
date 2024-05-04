import express from 'express';
import http from 'http';
import nodeRedApp from 'node-red';
import dotenv from 'dotenv';
import cors from 'cors';
import { DatabaseService } from './mongoService.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

dotenv.config();

const PORT_SERVER = process.env.PORT_SERVER || 4000;
// ENVIRONMENT VARIABLES
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = isProduction ? process.env.PRODUCTION_FRONTEND_URL : process.env.DEVELOPMENT_FRONTEND_URL;
const databaseURL = isProduction ? process.env.PRODUCTION_DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL;
const databaseName = process.env.DATABASE_NAME;
const databaseCollection = process.env.DATABASE_COLLECTION;

// CORS
const corsOptions = {
  origin: frontendURL,
  credentials: true, // access-control-allow-credentials:true
  allowedHeaders: ['Content-Type', 'Authorization'], // access-control-allow-headers
  optionSuccessStatus: 200,
};

// create an express app
var app = express();
app.use(cors(corsOptions));

// create a server
var server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// console.log('this is __filename');
// console.log(__filename);
// console.log('this is __dirname');
// console.log(__dirname);

// MAIN
(async () => {
  // get latest flow from mongodb
  const databaseService = new DatabaseService(databaseURL, databaseName, databaseCollection);
  await databaseService.connect();
  var flowFile = await databaseService.flowCollection.findOne({}, { sort: { dateLog: -1 } });
  // replace flow with the latest flow from mongodb
  fs.writeFileSync(path.join(__dirname, 'flows.json'), JSON.stringify(flowFile.flow, null, 2));

  // console.log('this is flowFile');
  // console.log(JSON.stringify(flowFile.flow, null, 2));

  // Create the NODE-RED settings object
  var settings = {
    httpAdminRoot: '/', //đường dẫn để vào trang quản trị (thường mình để /red hoặc /admin)
    httpNodeRoot: '/api', //đường dẫn mặc định để gọi API
    userDir: './node_red', //nơi lưu trữ các file cấu hình của Node-Red
    functionGlobalContext: {}, // enables global context
    flowFile: './src/flows.json',
    flowFilePretty: true,
    nodesDir: './node_red/nodes',
  };

  const flowFilePath = path.join(__dirname, 'flows.json');
  // add a listener to watch for changes in the flow file
  await fs.watch(flowFilePath, async (eventType, filename) => {
    if (eventType === 'rename') {
      console.log(`File ${filename} has been changed`);
      // code to handle the change
      // let latestFile = await databaseService.flowCollection.findOne({}, { sort: { dateLog: -1 } });

      // if (latestFile != tmpFile) {
      //   // if there is conflict between mongodb and local file
      //   console.log('THERE IS CONFLICT BETWEEN MONGODB AND LOCAL FILE, PLEASE FIX IT MANUALLY');
      //   server.close();
      // }

      // // update the flow in mongodb
      await databaseService.flowCollection.insertOne({
        flow: JSON.parse(fs.readFileSync(flowFilePath, 'utf8')),
        dateLog: new Date().toISOString(),
      });
    }
  });

  // Initialize the runtime with a server and settings
  nodeRedApp.init(server, settings);

  // Serve the editor UI from /red
  app.use(settings.httpAdminRoot, nodeRedApp.httpAdmin);

  // Serve the http nodes UI from /api
  app.use(settings.httpNodeRoot, nodeRedApp.httpNode);

  server.listen(PORT_SERVER, () => {
    console.log(`Node-Red server is running on ${PORT_SERVER}`);
  });

  // Start the runtime

  nodeRedApp.start();
})();

// var flowFile = getMongoInstance(databaseURL)
//   .db('flow_node_red')
//   .collection('flowJSON')
//   .find()
//   .sort({ dateField: -1 })
//   .limit(1);
