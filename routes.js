const exec = require('child_process').exec;
const express = require('express')
const routes = express.Router()

routes.get('/teamfight', (req, res)=>{

    const command = 'node build/genetic-algorithm.js teamfight 3633'; 
    const child = exec(command,
    function (error, stdout, stderr) {

        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        return res.send('ok')
    });  
})

module.exports = routes