var evolveGa = require("evolve-ga");
var createCollage = require("@settlin/collage");
var json = require("./assets/champions.json");
var fs = require("fs");
let generation = 1;
let execution = 1;
let finalFitvalue = 0;
let allChromosomes = [];
let totalChampions = 141;
let POPULATION_SIZE;
let MUTATION_CHANCE;
let MAX_GENERATIONS;
let MAX_EXECUTIONS = 3;
let COMPOSITION_STRATEGY;
let MAX_FIT_VALUE = 3633;
let filePathReports = "reports/" + COMPOSITION_STRATEGY + "/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";
let filePathTimeReports = "time-reports/" + COMPOSITION_STRATEGY + "/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";
var fileName = '';

class GeneticAlgorithm {

    constructor() {
        this.genetic = this.genetic.bind(this);

        this.crossOverFunction = this.crossOverFunction.bind(this);
        this.mutationFunction = this.mutationFunction.bind(this);
        this.fitnessFunction = this.fitnessFunction.bind(this);
        this.selectionFunction = this.selectionFunction.bind(this);

        this.numberCompare = this.numberCompare.bind(this);
        this.validChromosome = this.validChromosome.bind(this);
        this.validCompositionFunction = this.validCompositionFunction.bind(this);
        this.validRolesFunction = this.validRolesFunction.bind(this);
        this.showCompositionInfo = this.showCompositionInfo.bind(this);
    }

    validCompositionFunction(chromosome) {
        let validComposition = false;
        let hasCarry = false;
        let hasSupp = false;
        let hasApCarry = false;

        chromosome.genes.map(gene => {
            json.map(function (champion) {
                if (gene === champion.id) {

                    // console.log(hasApCarry);

                    if (champion.infos.magic >= 8 && !hasApCarry) {
                        hasApCarry = true;
                    }

                    champion.lanes.map((role) => {
                        if (role === 'Support' && !hasSupp) {
                            hasSupp = true;
                            hasApCarry = false;
                        }

                        if (role === 'Carry' && !hasCarry) {
                            hasCarry = true;
                            hasApCarry = false;
                        }
                    });

                }

                if (hasCarry && hasSupp && hasApCarry) {
                    validComposition = true;
                }

            });
        });

        return validComposition;
    };

    validRolesFunction(champion, strategies, multiplier) {
        if (!champion.roles) {
            return multiplier;
        }

        let hasStrategy = champion.roles.filter(value => strategies.includes(value)).length;

        if (!hasStrategy) {
            return multiplier;
        }

        return +(0.1 + multiplier).toFixed(12);
    }

    mutationFunction(chromosome, possibleGenes) {
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

        if (!this.validChromosome(aux[1])) {
            return {
                fitness: chromosome.fitness,
                genes: mutatedGenes
            };
        }
        else {
            return chromosome;
        }
    };

    crossOverFunction(chromosomes) {
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
            if (!this.validChromosome(aux[1])) {
                offspring.push({
                    fitness: 0,
                    genes: parentA.genes.slice(0, crossOverPoint).concat(parentB.genes.slice(crossOverPoint))
                });
            }
        }

        return offspring;
    };

    selectionFunction(chromosomes) {
        chromosomes = chromosomes
            .sort(function (a, b) { return b.fitness - a.fitness; })
            .slice(0, Math.ceil(chromosomes.length / 2));
        chromosomes.map((chromosome, i) => {
            if (this.validChromosome(chromosome)) {
                chromosomes.splice(i, 1);
            }
        });
        return chromosomes;
    };

    fitnessFunction(chromosome) {
        allChromosomes.push(chromosome);
        let validComposition = this.validCompositionFunction(chromosome);

        if (!validComposition) {
            return 0;
        }

        switch (COMPOSITION_STRATEGY) {
            case 'hardengage':
                var fitvalueHardEngage = 0;
                var attack_1 = 0;
                var movspeed_1 = 0;
                var multiplier = 1.0;
                var self = this;

                chromosome.genes.map(function (gene) {
                    json.map((champion) => {
                        if (gene === champion.id) {
                            attack_1 = attack_1 + champion.stats.attackdamage;
                            movspeed_1 = movspeed_1 + champion.stats.movespeed;
                            multiplier = self.validRolesFunction(champion, ['Hard Engage'], multiplier);
                        }
                    });
                });

                fitvalueHardEngage = ((attack_1 + movspeed_1) * multiplier) / MAX_FIT_VALUE;

                if (fitvalueHardEngage > finalFitvalue) {
                    finalFitvalue = fitvalueHardEngage;
                    this.finalChromosome = chromosome;
                }

                return fitvalueHardEngage;
            case 'teamfight':
                var fitvalueTeamfight = 0;
                var attackdamage_1 = 0;
                var attackdamagelevel_1 = 0;
                var healthpoints_1 = 0;
                var multiplier = 1.0;
                var self = this;

                chromosome.genes.map(function (gene) {
                    json.map(function (champion) {
                        if (gene === champion.id) {
                            attackdamage_1 = attackdamage_1 + champion.stats.attackdamage;
                            attackdamagelevel_1 = attackdamagelevel_1 + champion.stats.attackdamageperlevel;
                            healthpoints_1 = healthpoints_1 + champion.stats.hp;
                            multiplier = self.validRolesFunction(champion, ['Waveclear', 'Disengage', 'Crowd Control'], multiplier);
                        }
                    });
                });

                fitvalueTeamfight = ((attackdamage_1 + attackdamagelevel_1 + healthpoints_1) * multiplier) / MAX_FIT_VALUE;
                if (fitvalueTeamfight > finalFitvalue) {
                    this.finalFitvalue = fitvalueTeamfight;
                    this.finalChromosome = chromosome;
                }
                return fitvalueTeamfight;
            case 'pusher':
                var fitvaluePusher = 0;
                var attackdmg_1 = 0;
                var attackrange_1 = 0;
                var attackspeed_1 = 0;
                var multiplier = 1.0;
                var self = this;

                chromosome.genes.map(gene => {
                    json.map(function (champion) {
                        if (gene === champion.id) {
                            attackdmg_1 = attackdmg_1 + champion.stats.attackdamage;
                            attackrange_1 = attackrange_1 + champion.stats.attackrange;
                            attackspeed_1 = attackspeed_1 + champion.stats.attackspeedperlevel;
                            multiplier = self.validRolesFunction(champion, ['Waveclear'], multiplier);
                        }
                    });
                });

                fitvaluePusher = ((attackdmg_1 + attackrange_1 + attackspeed_1) * multiplier) / MAX_FIT_VALUE;
                if (fitvaluePusher > finalFitvalue) {
                    this.finalFitvalue = fitvaluePusher;
                    this.finalChromosome = chromosome;
                }
                return fitvaluePusher;
        }
    };

    validChromosome(chromosome) {
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

    showCompositionInfo() {
        var championsIcons = [];
        var parsedJson = JSON.parse(JSON.stringify(json));

        // var objJson = Object.keys(parsedJson);
        // delete objJson[0];

        // console.log(objJson.filter(value => value != 14));

        if (this.finalChromosome) {
            this.finalChromosome.genes.forEach(function (item) {
                var aux = parsedJson.find(function (champion) { return champion.id === item; });
                if (aux) {
                    championsIcons.push(aux.icon);
                }
            });
        }

        var options = {
            sources: championsIcons,
            width: 5,
            height: 1,
            imageWidth: 120,
            imageHeight: 120
        };

        createCollage(options).then(canvas => {
            var src = canvas.jpegStream();
            var dest = fs.createWriteStream(`${fileName}.png`);

            src.pipe(dest);
        });
    };

    numberCompare(a, b) {
        return a - b;
    };

    writeFileHeader() {
        fs.appendFileSync(filePathReports, "execution;generation;chromosome;fitness \r\n");
    };

    writeFileSecondsHeader() {
        fs.appendFileSync(filePathTimeReports, "execution;start;end;duration \r\n");
    };

    writeGenerationsOnFile() {
        allChromosomes.map(function (chromosome) {
            fs.appendFileSync(filePathReports, execution + ";" + generation + ";" + chromosome.genes.sort(this.numberCompare).toString() + ";" + chromosome.fitness + "\r\n");
        });
    };

    writeSecondsOnFile(start, end, duration) {
        fs.appendFileSync(filePathTimeReports, execution + ";" + start + ";" + end + ";" + duration + " \r\n");
    };

    createReportFiles() {
        fs.writeFile(filePathReports, "", function () { });
        fs.writeFile(filePathTimeReports, "", function () { });
    };

    // createReportFiles();
    // writeFileHeader();
    // writeFileSecondsHeader();

    genetic() {
        var start = new Date();
        this.algorithm.resetPopulation();

        while (generation <= MAX_GENERATIONS) {
            this.algorithm.run();
            // this.writeGenerationsOnFile();
            this.allChromosomes = [];
            generation++;
            // console.log(this.finalFitvalue);
        }

        // console.log(this.finalFitvalue);
        this.showCompositionInfo();
        this.finalFitvalue = 0;
        var end = new Date();
        // this.writeSecondsOnFile(start, end, end.getTime() - start.getTime());
    }

    start(strategy, maxFitValue, populationSize, mutationChance, maxGenerations, bannedGenes) {
        MAX_GENERATIONS = maxGenerations;
        COMPOSITION_STRATEGY = strategy;
        MAX_FIT_VALUE = maxFitValue;
        POPULATION_SIZE = populationSize;
        MUTATION_CHANCE = mutationChance;

        let possibleGenes = Array.apply(null, { length: totalChampions }).map(Number.call, Number);
        let champions = possibleGenes;

        if (bannedGenes) {
            champions = possibleGenes.filter(x => !bannedGenes.includes(x));
        }

        this.algorithm = evolveGa.evolve({
            populationSize: POPULATION_SIZE,
            chromosomeLength: 5,
            possibleGenes: champions,
            mutationChance: MUTATION_CHANCE,
            fitnessFunction: this.fitnessFunction,
            selectionFunction: this.selectionFunction,
            crossOverFunction: this.crossOverFunction,
            mutationFunction: this.mutationFunction
        });

        fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.genetic();
        return fileName;
    }
}

module.exports = new GeneticAlgorithm()