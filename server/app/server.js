require('dotenv/config')
const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const server = express();

server.use(cors())
server.use(express.json())
server.use('/api/v1', routes)

server.listen(process.env.PORT || 3333)