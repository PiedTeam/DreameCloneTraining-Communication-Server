var http = require('http')
var express = require('express')
var nodeRedApp = require('node-red')

const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT

// Create an Express app
var app = express()

// IMPLEMENT CORS IF YOU WANT TO INTERACT NODE-RED FROM FRONTEND OR OTHER SERVER
// const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:3000",
// };

// app.use(cors(corsOptions));

// Add a simple route for static content served from 'public'
// app.use('/', express.static('public'))

// Create a server
var server = http.createServer(app)

// Create the NODE-RED settings object
var settings = {
  httpAdminRoot: '/', //đường dẫn để vào trang quản trị (thường mình để /red hoặc /admin)
  httpNodeRoot: '/api', //đường dẫn mặc định để gọi API
  userDir: './node_red', //nơi lưu trữ các file cấu hình của Node-Red
  functionGlobalContext: {}, // enables global context
  flowFile: './flows.json',
  flowFilePretty: true,
  nodesDir: './node_red/nodes'
}

// Initialize the runtime with a server and settings
nodeRedApp.init(server, settings)

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, nodeRedApp.httpAdmin)

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, nodeRedApp.httpNode)

server.listen(PORT, () => {
  console.log(`Node-Red đang chạy trên Port ${PORT}`)
})

// Start the runtime

nodeRedApp.start()
