const exec = require('child_process').exec;;
const express = require('express');
const LeagueRandomicAlgorithm = require('./league-randomic-algorithm');
const DotaAlgorithm = require('./dota-algorithm');
const LeagueAlgorithm = require('./league-algorithm');

const routes = express.Router();

routes.get('/dota', (req, res) => {

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

    let fileName = DotaAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, currentExecution, bannedChampions, pickedChampions);

    // res.send(fileName);

    return res.json({ filename: fileName });
})

routes.get('/league', (req, res) => {

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

    let fileName = LeagueAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, currentExecution, bannedChampions, pickedChampions);

    // res.send(fileName);

    return res.json({ filename: fileName });
})

routes.get('/randomic', (req, res) => {

    let { strategy, maxFitValue, currentExecution, bannedChampions, pickedChampions } = req.query;

    console.log('recebido');

    // RandomicAlgorithm.start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, currentExecution, bannedChampions, pickedChampions);
    LeagueRandomicAlgorithm.start();

    return res.json('Geração randômica finalizada.');
})

module.exports = routes