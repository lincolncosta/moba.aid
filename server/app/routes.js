const express = require('express');
const DotaAlgorithm = require('./dota-algorithm');
const LeagueAlgorithm = require('./league-algorithm');
const ChampionController = require('./controllers/ChampionController');

const routes = express.Router();

// Health Check
routes.get('/', (req, res) => {
  res.sendStatus(200);
});

routes.get('/dota', (req, res) => {
  let {
    strategy,
    max_fit_value,
    population_size,
    mutation_chance,
    max_generations,
    current_execution,
    bannedChampions,
    pickedChampions,
  } = req.query;

  let banned_genes = [];
  banned_genes.push(bannedChampions);

  if (banned_genes) {
    bannedChampions = banned_genes.map(function(item) {
      return Number(item);
    });
  }

  let picked_genes = [];
  picked_genes.push(pickedChampions);

  if (picked_genes) {
    pickedChampions = picked_genes.map(function(item) {
      return Number(item);
    });
  }

  let fileName = DotaAlgorithm.start(
    strategy,
    max_fit_value,
    population_size,
    mutation_chance,
    max_generations,
    current_execution,
    bannedChampions,
    pickedChampions,
  );

  // res.send(fileName);

  return res.json({ filename: fileName });
});

routes.get('/league', (req, res) => {
  let {
    strategy,
    max_fit_value,
    population_size,
    mutation_chance,
    max_generations,
    current_execution,
    banned_champions,
    picked_champions,
    enemy_champions,
  } = req.query;

  let bannedGenes = [];
  let enemyGenes = [];
  let pickedGenes = [];

  if (banned_champions) {
    banned_champions.map(function(item) {
      bannedGenes.push(Number(item));
    });
  }

  if (enemy_champions) {
    enemy_champions.map(function(item) {
      enemyGenes.push(Number(item));
    });
  }

  if (picked_champions) {
    picked_champions.map(function(item) {
      pickedGenes.push(Number(item));
    });
  }

  let fileName = LeagueAlgorithm.start(
    strategy,
    max_fit_value,
    population_size,
    mutation_chance,
    max_generations,
    current_execution,
    bannedGenes,
    pickedGenes,
    enemyGenes,
  );

  // res.send(fileName);

  return res.json({ filename: fileName });
});

routes.get('/randomic', (req, res) => {
  // Desenvolver geração randômica.++
  // let { strategy, max_fit_value, current_execution, bannedChampions, pickedChampions } = req.query;

  console.log('recebido');
  // LeagueRandomicAlgorithm.start();

  return res.json('Geração randômica finalizada.');
});

routes.get('/champions', ChampionController.index);

routes.post('/champions', ChampionController.store);

module.exports = routes;
