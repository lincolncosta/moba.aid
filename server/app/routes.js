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

routes.get('/result', (req, res) => {

    let { strategy, maxFitValue, populationSize, mutationChance, maxGenerations, currentExecution, bannedChampions, pickedChampions } = req.query;

    let bannedGenes = [];
    bannedGenes.push(bannedChampions);

    if (bannedGenes) {
        bannedChampions = bannedGenes.map(function (item) {
            return Number(item);
        });
    }

    let pickedGenes = [];
    pickedGenes.push(pickedChampions);

    if (pickedGenes) {
        pickedChampions = pickedGenes.map(function (item) {
            return Number(item);
        });
    }

    let fileName = GeneticAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, currentExecution, bannedChampions, pickedChampions);

    // res.send(fileName);

    return res.json({ filename: fileName })
})

module.exports = routes