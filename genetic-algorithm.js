"use strict";
exports.__esModule = true;
var evolve_ga_1 = require("evolve-ga");
var json = require("./champions.json");
var solved = false;
var generation = 0;
var finalChromosome;
var maxGenerations = 500;
var totalChampions = 141;
var mutationFunction = function (chromosome, possibleGenes) {
    var mutatedGenes = chromosome.genes.slice();
    var geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
    var possibleGenesFiltered = possibleGenes.filter(function (gene) {
        return gene !== mutatedGenes[geneToMutateIndex];
    });
    mutatedGenes[geneToMutateIndex] =
        possibleGenesFiltered[Math.floor(Math.random() * possibleGenesFiltered.length)];
    return {
        fitness: chromosome.fitness,
        genes: mutatedGenes
    };
};
var crossOverFunction = function (chromosomes) {
    var offspring = [];
    var aux = [];
    for (var i = 0; i < chromosomes.length; i++) {
        var crossOverPoint = Math.floor(Math.random() * chromosomes[i].genes.length);
        var parentA = chromosomes[Math.floor(Math.random() * chromosomes.length)];
        var parentB = chromosomes[Math.floor(Math.random() * chromosomes.length)];
        aux[1] = {
            fitness: 0,
            genes: parentA.genes.slice(0, crossOverPoint).concat(parentB.genes.slice(crossOverPoint))
        };
        if (!validChromosome(aux[1])) {
            offspring.push({
                fitness: 0,
                genes: parentA.genes.slice(0, crossOverPoint).concat(parentB.genes.slice(crossOverPoint))
            });
        }
    }
    return offspring;
};
var selectionFunction = function (chromosomes) {
    chromosomes = chromosomes
        .sort(function (a, b) { return b.fitness - a.fitness; })
        .slice(0, Math.ceil(chromosomes.length / 2));
    chromosomes.map(function (chromosome, i) {
        if (validChromosome(chromosome)) {
        }
    });
    return chromosomes;
};
var fitnessFunction = function (chromosome) {
    var fitvalue = 0;
    var attack = 0;
    var movspeed = 0;
    chromosome.genes.map(function (gene) {
        json.map(function (champion) {
            if (gene === champion.id) {
                attack = attack + champion.stats.attackdamage;
                movspeed = movspeed + champion.stats.movespeed;
                fitvalue = attack + movspeed;
                fitvalue = ((fitvalue * 100) / 210).toFixed(2);
            }
        });
    });
    // Ajustar critério de parada conforme evolução.
    if (fitvalue > 900) {
        solved = true;
        finalChromosome = chromosome;
    }
    return fitvalue;
};
var validChromosome = function (chromosome) {
    debugger;
    var control = false;
    var genes = chromosome.genes;
    genes.forEach(function (item) {
        var filteredArray = genes.filter(function (itemFilter) { return item === itemFilter; });
        if (filteredArray.length > 1) {
            control = true;
        }
    });
    return control;
};
var algorithm = evolve_ga_1.evolve({
    populationSize: 10000,
    chromosomeLength: 5,
    possibleGenes: Array.apply(null, { length: totalChampions }).map(Number.call, Number),
    mutationChance: 0.7,
    fitnessFunction: fitnessFunction,
    selectionFunction: selectionFunction,
    crossOverFunction: crossOverFunction,
    mutationFunction: mutationFunction
});
var showCompositionInfo = function () {
    console.log("COMPOSIÇÃO FINAL");
    var parsedJson = JSON.parse(JSON.stringify(json));
    finalChromosome.genes.forEach(function (item) {
        var aux = parsedJson.find(function (champion) { return champion.id === item; });
        if (aux) {
            console.log(aux.localized_name);
        }
    });
    console.log("----------------");
};
while (!solved && generation < maxGenerations) {
    generation++;
    algorithm.run();
}
showCompositionInfo();
