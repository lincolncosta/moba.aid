const exec = require('child_process').exec;
const express = require('express')
const routes = express.Router()
const RandomicAlgorithm = require('./randomic-algorithm')
const GeneticAlgorithm = require('./genetic-algorithm')

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

    return res.json({ filename: fileName });
})

routes.get('/randomic', (req, res) => {

    let { strategy, maxFitValue, currentExecution, bannedChampions, pickedChampions } = req.query;

    console.log('recebido');

    // RandomicAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, currentExecution, bannedChampions, pickedChampions);
    RandomicAlgorithm.start();

    return res.json('Geração randômica finalizada.');
})

module.exports = routes