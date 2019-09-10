const express = require('express')
const routes = require('./routes')

const server = express();

server.use('/img', express.static('public'))
server.use(express.json())
server.use(routes)

server.listen(process.env.PORT || 3333)