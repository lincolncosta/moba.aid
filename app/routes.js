const exec = require('child_process').exec;
const express = require('express')
const routes = express.Router()
const RandomicAlgorithm = require('./randomic-algorithm')
const GeneticAlgorithm = require('./genetic-algorithm')

routes.get('/teamfight', (req, res) => {

    GeneticAlgorithm.start();
    res.send('ok')

    // const command = 'node build/genetic-algorithm.js teamfight 3633'; 
    // const child = exec(command,
    // function (error, stdout, stderr) {

    //     console.log('stdout: ' + stdout);
    //     console.log('stderr: ' + stderr);
    //     if (error !== null) {
    //         console.log('exec error: ' + error);
    //     }
    //     return res.send('ok')
    // });  
})

routes.get('/randomic', (req, res) => {
    
    // TODO esperar o callback do start para mostrar o resultado
    RandomicAlgorithm.start()
    res.send('ok')
})

routes.post('/result', (req, res) =>{
    const { strategy, maxFitValue, populationSize, mutationChance, maxGenerations } = req.body;

    return res.send(`${strategy, maxFitValue, populationSize, mutationChance, maxGenerations}`)
})

module.exports = routes