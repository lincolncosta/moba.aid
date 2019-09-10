var evolveGa = require("evolve-ga");
var createCollage = require("@settlin/collage");
var json = require("./assets/champions.json");
var fs = require("fs");
let generation = 1;
let execution = 1;
let finalFitvalue = 0;
let allChromosomes = [];
let totalChampions = 14;
let POPULATION_SIZE = 3;
let MUTATION_CHANCE = 0.7;
let MAX_GENERATIONS = 10;
let MAX_EXECUTIONS = 3;
let strategy = 'teamfight';
let maxFitValue = 3633;
let filePathReports = "reports/" + strategy + "/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";
let filePathTimeReports = "time-reports/" + strategy + "/PS-" + POPULATION_SIZE + "__MC-" + MUTATION_CHANCE + "__MG-" + MAX_GENERATIONS + ".csv";

class GeneticAlgorithm {
    
    constructor (){
        this.geneticAlgorithm = this.genetic.bind(this);

        this.crossOverFunction = this.crossOverFunction.bind(this);
        this.mutationFunction = this.mutationFunction.bind(this);
        this.fitnessFunction = this.fitnessFunction.bind(this);
        this.selectionFunction = this.selectionFunction.bind(this);

        this.numberCompare = this.numberCompare.bind(this);
        this.validChromosome = this.validChromosome.bind(this);
        this.validCompositionFunction = this.validCompositionFunction.bind(this);

        this.algorithm = evolveGa.evolve({
            populationSize: POPULATION_SIZE,
            chromosomeLength: 5,
            possibleGenes: Array.apply(null, { length: totalChampions }).map(Number.call, Number),
            mutationChance: MUTATION_CHANCE,
            fitnessFunction: this.fitnessFunction,
            selectionFunction: this.selectionFunction,
            crossOverFunction: this.crossOverFunction,
            mutationFunction: this.mutationFunction
        });

        this.finalChromosome = null;
    }

    validCompositionFunction(chromosome) {
        var validComposition = false;
        var hasCarry = false;
        var hasSupp = false;

        chromosome.genes.map(gene => {
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
        chromosomes.map( (chromosome, i) => {
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
                    this.finalChromosome = chromosome;
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
                    this.finalChromosome = chromosome;
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

        this.finalChromosome.genes.forEach(function (item) {
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
            this.generation = this.generation++;
            console.log(finalFitvalue);
            console.log(generation);
        }

        this.showCompositionInfo();
        this.finalChromosome = null;
        this.finalFitvalue = 0;
        var end = new Date();
        // this.writeSecondsOnFile(start, end, end.getTime() - start.getTime());

    }
    
    start(){
        this.genetic();
    }
}

module.exports = new GeneticAlgorithm()