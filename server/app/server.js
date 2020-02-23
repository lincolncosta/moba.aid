require('dotenv/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const routes = require('./routes');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('deu boa!')
});

const server = express();

server.use(cors())
server.use(express.json())
server.use('/api/v1', routes)

server.listen(process.env.PORT || 3333)