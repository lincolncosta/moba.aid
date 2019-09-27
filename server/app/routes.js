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

    let { strategy, maxFitValue, populationSize, mutationChance, maxGenerations, bannedChampions } = req.query;

    let bannedGenes = [];
    bannedGenes.push(bannedChampions);

    if (bannedGenes) {
        bannedChampions = bannedGenes.map(function (item) {
            return Number(item);
        });
    }

    let fileName = GeneticAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, bannedChampions);

    // res.send(fileName);

    return res.json({ filename: fileName })
})

module.exports = routes