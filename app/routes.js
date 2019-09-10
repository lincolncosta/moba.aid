const exec = require('child_process').exec;
const express = require('express')
const routes = express.Router()
const RandomicAlgorithm = require('./randomic-algorithm')
const GeneticAlgorithm = require('./genetic-algorithm')

routes.get('/teamfight', (req, res) => {

    let fileName = GeneticAlgorithm.start();
    res.send(fileName);  
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