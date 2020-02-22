const exec = require('child_process').exec;
const express = require('express');
const LeagueRandomicAlgorithm = require('./league-randomic-algorithm');
const DotaAlgorithm = require('./dota-algorithm');
const LeagueAlgorithm = require('./league-algorithm');

const routes = express.Router();

routes.get('/dota', (req, res) => {

    let { strategy, max_fit_value, population_size, mutation_chance, max_generations, current_execution, bannedChampions, pickedChampions } = req.query;

    let banned_genes = [];
    banned_genes.push(bannedChampions);

    if (banned_genes) {
        bannedChampions = banned_genes.map(function (item) {
            return Number(item);
        });
    }

    let picked_genes = [];
    picked_genes.push(pickedChampions);

    if (picked_genes) {
        pickedChampions = picked_genes.map(function (item) {
            return Number(item);
        });
    }

    let fileName = DotaAlgorithm.start(strategy, max_fit_value, population_size, mutation_chance, max_generations, current_execution, bannedChampions, pickedChampions);

    // res.send(fileName);

    return res.json({ filename: fileName });
})

routes.get('/api/league', (req, res) => {

    let { strategy, max_fit_value, population_size, mutation_chance, max_generations, current_execution, banned_champions, picked_champions, enemy_champions } = req.query;

    let bannedGenes = [];
    let enemyGenes = [];

    if (bannedChampions) {
        bannedGenes.map(function (item) {
            bannedGenes.push(Number(item));
        });
    }

    if (enemyChampions) {
        enemyChampions.map(function (item) {
            enemyGenes.push(Number(item));
        });
    }

    let pickedGenes = [];
    pickedGenes.push(pickedChampions);

    if (pickedChampions) {
        pickedChampions.map(function (item) {
            pickedGenes.push(Number(item));
        });
    }

    let fileName = LeagueAlgorithm.start(strategy, max_fit_value, population_size, mutation_chance, max_generations, current_execution, banned_genes, picked_genes, enemy_genes);

    // res.send(fileName);

    return res.json({ filename: fileName });
})

routes.get('/randomic', (req, res) => {

    let { strategy, max_fit_value, current_execution, bannedChampions, pickedChampions } = req.query;

    console.log('recebido');

    // RandomicAlgorithm.start(strategy, max_fit_value, population_size, mutation_chance, max_generations, current_execution, bannedChampions, pickedChampions);
    LeagueRandomicAlgorithm.start();

    return res.json('Geração randômica finalizada.');
})

module.exports = routes