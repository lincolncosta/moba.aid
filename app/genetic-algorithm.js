<<<<<<< HEAD
var evolve_ga_1 = require("evolve-ga");
var createCollage = require("@settlin/collage");
var json = require("./assets/champions.json");
=======
"use strict";
exports.__esModule = true;
var evolve_ga_1 = require("evolve-ga");
var createCollage = require("@settlin/collage");
var json = require("../champions.json");
>>>>>>> 2679ba9bf59a8805ffad3b2609f334e77d2b4776
var fs = require("fs");
var generation = 1;
var execution = 1;
var finalChromosome;
var finalFitvalue = 0;
var allChromosomes = [];
<<<<<<< HEAD
var totalChampions = 141;
var POPULATION_SIZE = 30;
var MUTATION_CHANCE = 0.7;
var MAX_GENERATIONS = 1000;
var MAX_EXECUTIONS = 30;
=======
var totalChampions = 14;
var POPULATION_SIZE = 3;
var MUTATION_CHANCE = 0.7;
var MAX_GENERATIONS = 10;
var MAX_EXECUTIONS = 3;
>>>>>>> 2679ba9bf59a8805ffad3b2609f334e77d2b4776
var strategy = process.argv[2];
var maxFitValue = parseInt(process.argv[3]);
var filePathReports = "reports/" + strategy + "/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";
var filePathTimeReports = "time-reports/" + strategy + "/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";
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
var validCompositionFunction = function (chromosome) {
    var validComposition = false;
    var hasCarry = false;
    var hasSupp = false;
    chromosome.genes.map(function (gene) {
        json.map(function (champion) {
            if (gene === champion.id) {
                champion.roles.map(function (role) {
                    if (role === 'Support') {
                        hasSupp = true;
                    }
                    if (role === 'Carry') {
                        hasCarry = true;
                    }
                });
            }
            if (hasCarry && hasSupp) {
                validComposition = true;
            }
        });
    });
    return validComposition;
};
var fitnessFunction = function (chromosome) {
    allChromosomes.push(chromosome);
    var validComposition = validCompositionFunction(chromosome);
    if (!validComposition) {
        return 0;
    }
    switch (strategy) {
        case 'hardengage':
            var fitvalueHardEngage = 0;
            var attack_1 = 0;
            var movspeed_1 = 0;
            chromosome.genes.map(function (gene) {
                json.map(function (champion) {
                    if (gene === champion.id) {
                        attack_1 = attack_1 + champion.stats.attackdamage;
                        movspeed_1 = movspeed_1 + champion.stats.movespeed;
                    }
                });
            });
            fitvalueHardEngage = (attack_1 + movspeed_1) / maxFitValue;
            if (fitvalueHardEngage > finalFitvalue) {
                finalFitvalue = fitvalueHardEngage;
                finalChromosome = chromosome;
            }
            return fitvalueHardEngage;
        case 'teamfight':
            var fitvalueTeamfight = 0;
            var attackdamage_1 = 0;
            var attackdamagelevel_1 = 0;
            var healthpoints_1 = 0;
            chromosome.genes.map(function (gene) {
                json.map(function (champion) {
                    if (gene === champion.id) {
                        attackdamage_1 = attackdamage_1 + champion.stats.attackdamage;
                        attackdamagelevel_1 = attackdamagelevel_1 + champion.stats.attackdamageperlevel;
                        healthpoints_1 = healthpoints_1 + champion.stats.hp;
                    }
                });
            });
            fitvalueTeamfight = (attackdamage_1 + attackdamagelevel_1 + healthpoints_1) / maxFitValue;
            if (fitvalueTeamfight > finalFitvalue) {
                finalFitvalue = fitvalueTeamfight;
                finalChromosome = chromosome;
            }
            return fitvalueTeamfight;
        case 'pusher':
            var fitvaluePusher = 0;
            var attackdmg_1 = 0;
            var attackrange_1 = 0;
            var attackspeed_1 = 0;
            chromosome.genes.map(function (gene) {
                json.map(function (champion) {
                    if (gene === champion.id) {
                        attackdmg_1 = attackdmg_1 + champion.stats.attackdamage;
                        attackrange_1 = attackrange_1 + champion.stats.attackrange;
                        attackspeed_1 = attackspeed_1 + champion.stats.attackspeedperlevel;
                    }
                });
            });
            fitvaluePusher = (attackdmg_1 + attackrange_1 + attackspeed_1) / maxFitValue;
            if (fitvaluePusher > finalFitvalue) {
                finalFitvalue = fitvaluePusher;
                finalChromosome = chromosome;
            }
            return fitvaluePusher;
    }
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
    var championsIcons = [];
    var parsedJson = JSON.parse(JSON.stringify(json));
    finalChromosome.genes.forEach(function (item) {
        var aux = parsedJson.find(function (champion) { return champion.id === item; });
        if (aux) {
            championsIcons.push(aux.icon);
        }
    });
    var options = {
        sources: championsIcons,
        width: 5,
        height: 1,
        imageWidth: 120,
        imageHeight: 120
    };
    createCollage(options)
        .then(function (canvas) {
        var src = canvas.jpegStream();
        var dest = fs.createWriteStream(strategy + ".png");
        src.pipe(dest);
    });
};
var numberCompare = function (a, b) {
    return a - b;
};
var writeFileHeader = function () {
    fs.appendFileSync(filePathReports, "execution;generation;chromosome;fitness \r\n");
};
var writeFileSecondsHeader = function () {
    fs.appendFileSync(filePathTimeReports, "execution;start;end;duration \r\n");
};
var writeGenerationsOnFile = function () {
    allChromosomes.map(function (chromosome) {
        fs.appendFileSync(filePathReports, execution + ";" + generation + ";" + chromosome.genes.sort(numberCompare).toString() + ";" + chromosome.fitness + "\r\n");
    });
};
var writeSecondsOnFile = function (start, end, duration) {
    fs.appendFileSync(filePathTimeReports, execution + ";" + start + ";" + end + ";" + duration + " \r\n");
};
var createReportFiles = function () {
    fs.writeFile(filePathReports, "", function () { });
    fs.writeFile(filePathTimeReports, "", function () { });
};
createReportFiles();
<<<<<<< HEAD
// writeFileHeader();
// writeFileSecondsHeader();
=======
writeFileHeader();
writeFileSecondsHeader();
>>>>>>> 2679ba9bf59a8805ffad3b2609f334e77d2b4776
for (execution = 1; execution <= MAX_EXECUTIONS; execution++) {
    var start = new Date();
    algorithm.resetPopulation();
    while (finalFitvalue < maxFitValue && generation <= MAX_GENERATIONS) {
        algorithm.run();
<<<<<<< HEAD
        // writeGenerationsOnFile();
=======
        writeGenerationsOnFile();
>>>>>>> 2679ba9bf59a8805ffad3b2609f334e77d2b4776
        allChromosomes = [];
        generation++;
    }
    showCompositionInfo();
    finalChromosome = null;
    finalFitvalue = 0;
    generation = 1;
    var end = new Date();
<<<<<<< HEAD
    // writeSecondsOnFile(start, end, end.getTime() - start.getTime());
}
=======
    writeSecondsOnFile(start, end, end.getTime() - start.getTime());
}
>>>>>>> 2679ba9bf59a8805ffad3b2609f334e77d2b4776
