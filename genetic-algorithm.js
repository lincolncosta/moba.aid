"use strict";
exports.__esModule = true;
var evolve_ga_1 = require("evolve-ga");
var json = require("./champions.json");
var fs = require("fs");
var generation = 0;
var finalChromosome;
var finalFitvalue = 0;
var maxFitValue = 2125;
var totalChampions = 141;
var POPULATION_SIZE = 700;
var MUTATION_CHANCE = 0.5;
var MAX_GENERATIONS = 25;
var mutationFunction = function (chromosome, possibleGenes) {
    var mutatedGenes = chromosome.genes.slice();
    var geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
    var possibleGenesFiltered = possibleGenes.filter(function (gene) {
        return gene !== mutatedGenes[geneToMutateIndex];
    });
    mutatedGenes[geneToMutateIndex] =
        possibleGenesFiltered[Math.floor(Math.random() * possibleGenesFiltered.length)];
    var aux = [];
    aux[1] = {
        fitness: 0,
        genes: mutatedGenes
    };
    if (!validChromosome(aux[1])) {
        return {
            fitness: chromosome.fitness,
            genes: mutatedGenes
        };
    }
    else {
        return chromosome;
    }
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
            chromosomes.splice(i, 1);
        }
    });
    return chromosomes;
};
var fitnessFunction = function (chromosome) {
    var fitvalue = 0;
    var attack = 0;
    var movspeed = 0;
    var fighter = 0;
    chromosome.genes.map(function (gene) {
        json.map(function (champion) {
            if (gene === champion.id) {
                attack = attack + champion.stats.attackdamage;
                movspeed = movspeed + champion.stats.movespeed;
            }
        });
    });
    fitvalue = attack + movspeed;
    if (fitvalue > finalFitvalue) {
        finalFitvalue = fitvalue;
        finalChromosome = chromosome;
    }
    return fitvalue;
};
var validChromosome = function (chromosome) {
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
    populationSize: POPULATION_SIZE,
    chromosomeLength: 5,
    possibleGenes: Array.apply(null, { length: totalChampions }).map(Number.call, Number),
    mutationChance: MUTATION_CHANCE,
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
var numberCompare = function (a, b) {
    return a - b;
};
var filePath = "reports/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";
fs.writeFile(filePath, "", function () {
    console.log("File manipulation end.");
});
for (var i = 0; i < 100; i++) {
    while (finalFitvalue < maxFitValue && generation < MAX_GENERATIONS) {
        generation++;
        algorithm.run();
    }
    fs.appendFileSync(filePath, finalChromosome.genes.sort(numberCompare).toString() +
        "  fit = " +
        finalFitvalue +
        "\r\n");
    finalChromosome = null;
    finalFitvalue = 0;
    generation = 0;
}
