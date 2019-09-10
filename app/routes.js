const exec = require('child_process').exec;
const express = require('express')
const routes = express.Router()
const RandomicAlgorithm = require('./randomic-algorithm')
const GeneticAlgorithm = require('./genetic-algorithm')

routes.get('/randomic', (req, res) => {
    
    // TODO esperar o callback do start para mostrar o resultado
    RandomicAlgorithm.start()
    res.send('ok')
})

routes.post('/result', (req, res) =>{
    const { strategy, maxFitValue, populationSize, mutationChance, maxGenerations } = req.body;
    let fileName = GeneticAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations);

    // res.send(fileName);

    return res.send(`${strategy, maxFitValue, populationSize, mutationChance, maxGenerations, fileName}`)
})

module.exports = routes