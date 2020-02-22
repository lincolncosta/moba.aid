const GeneticAlgorithm = require('./genetic-algorithm');
const evolveGa = require("evolve-ga");
const createCollage = require("@settlin/collage");
const json = require("./assets/league/champions.json");
const fs = require("fs");
// const uploadFile = require("./uploadFile");
let generation = 1;
let execution = 1;
let finalFitvalue = 0;
let allChromosomes = [];
let ENEMY_GENES = [];
let totalChampions = 146;
let POPULATION_SIZE;
let MUTATION_CHANCE;
let MAX_GENERATIONS;
let MAX_EXECUTIONS = 3;
let COMPOSITION_STRATEGY;
let MAX_FIT_VALUE = 81.28;
let CURRENT_EXECUTION;
var fileName = "";
let filePathReports = '';
let filePathTimeReports = '';

class LeagueAlgorithm extends GeneticAlgorithm {
    constructor() {
        super();
        this.genetic = this.genetic.bind(this);

        this.crossOverFunction = this.crossOverFunction.bind(this);
        this.mutationFunction = this.mutationFunction.bind(this);
        this.fitnessFunction = this.fitnessFunction.bind(this);
        this.selectionFunction = this.selectionFunction.bind(this);

        this.validChromosome = this.validChromosome.bind(this);
        this.validCompositionFunction = this.validCompositionFunction.bind(this);
        this.validRolesFunction = this.validRolesFunction.bind(this);
        this.showCompositionInfo = this.showCompositionInfo.bind(this);
    }

    validCompositionFunction(chromosome) {
        let winrateComposition = 0;

        let hasCarry = false;
        let winrateCarry = 0;

        let hasSupp = false;
        let winrateSupp = 0;

        let hasMid = false;
        let winrateMid = 0;

        let hasTop = false;
        let winrateTop = 0;

        let hasJungle = false;
        let winrateJungle = 0;

        chromosome.genes.map(gene => {
            json.map(function (champion) {
                if (gene === champion.id) {
                    Object.entries(champion.infos.winrate).forEach(([role, winrate]) => {
                        if (role === "top" && !hasTop) {
                            hasTop = true;
                            winrateTop = winrate;
                            return;
                        }

                        if (role === "jungler" && !hasJungle) {
                            hasJungle = true;
                            winrateJungle = winrate;
                            return;
                        }

                        if (role === "mid" && !hasMid) {
                            hasMid = true;
                            winrateMid = winrate;
                            return;
                        }

                        if (role === "carry" && !hasCarry) {
                            hasCarry = true;
                            winrateCarry = winrate;
                            return;
                        }

                        if (role === "support" && !hasSupp) {
                            hasSupp = true;
                            winrateSupp = winrate;
                            return;
                        }
                    });
                }

                if (hasCarry && hasSupp && hasMid && hasTop && hasJungle) {
                    winrateComposition =
                        (winrateCarry +
                            winrateSupp +
                            winrateMid +
                            winrateTop +
                            winrateJungle) /
                        5;
                }
            });
        });

        return winrateComposition;
    }

    validRolesFunction(champion, strategies, multiplier) {
        if (!champion.roles) {
            return multiplier;
        }

        let hasStrategy = champion.roles.filter(value => strategies.includes(value))
            .length;

        if (!hasStrategy) {
            return multiplier;
        }

        return +(0.1 + multiplier).toFixed(12);
    }

    validCountersFunction(champion, multiplier) {
        if (!champion.counters) {
            return multiplier;
        }

        console.log(champion.counters);

        let isCountered = champion.counters.filter(value => ENEMY_GENES.includes(value))
            .length;

        if (isCountered) {
            return multiplier;
        }

        return +(0.1 + multiplier).toFixed(12);
    }

    fitnessFunction(chromosome) {
        allChromosomes.push(chromosome);

        switch (COMPOSITION_STRATEGY) {
            case "hardengage":
                var fitvalueHardEngage = 0;
                fitvalueHardEngage = this.validCompositionFunction(chromosome);
                var multiplier = 1.0;
                var self = this;

                chromosome.genes.map(function (gene) {
                    json.map(champion => {
                        if (gene === champion.id) {
                            multiplier = self.validRolesFunction(
                                champion,
                                ["Hard Engage"],
                                multiplier
                            );

                            if (ENEMY_GENES.length) {
                                multiplier = self.validCountersFunction(
                                    champion,
                                    multiplier
                                );
                            }
                        }
                    });
                });

                fitvalueHardEngage = (fitvalueHardEngage * multiplier) / MAX_FIT_VALUE;

                if (fitvalueHardEngage > finalFitvalue) {
                    finalFitvalue = fitvalueHardEngage;
                    this.finalChromosome = chromosome;
                }

                return fitvalueHardEngage;
            case "teamfight":
                var fitvalueTeamFight = this.validCompositionFunction(chromosome);
                var multiplier = 1.0;
                var self = this;

                chromosome.genes.map(function (gene) {
                    json.map(champion => {
                        if (gene === champion.id) {
                            multiplier = self.validRolesFunction(
                                champion,
                                ["Area of Effect"],
                                multiplier
                            );
                        }
                    });
                });

                fitvalueTeamFight = (fitvalueTeamFight * multiplier) / MAX_FIT_VALUE;

                if (fitvalueTeamFight > finalFitvalue) {
                    finalFitvalue = fitvalueTeamFight;
                    this.finalChromosome = chromosome;
                }

                return fitvalueTeamFight;
            case "pusher":
                var fitvaluePusher = this.validCompositionFunction(chromosome);
                var multiplier = 1.0;
                var self = this;

                chromosome.genes.map(function (gene) {
                    json.map(champion => {
                        if (gene === champion.id) {
                            multiplier = self.validRolesFunction(
                                champion,
                                ["Poke", "Waveclear"],
                                multiplier
                            );
                        }
                    });
                });

                fitvaluePusher = (fitvaluePusher * multiplier) / MAX_FIT_VALUE;

                if (fitvaluePusher > finalFitvalue) {
                    finalFitvalue = fitvaluePusher;
                    this.finalChromosome = chromosome;
                }

                return fitvaluePusher;
        }
    }

    showCompositionInfo() {
        var championsIcons = [];
        var parsedJson = JSON.parse(JSON.stringify(json));

        if (this.finalChromosome) {
            this.finalChromosome.genes.forEach(function (item) {
                var aux = parsedJson.find(function (champion) {
                    return champion.id === item;
                });
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
            const blobName = `${fileName}.png`;
            var dest = fs.createWriteStream(blobName);

            src.pipe(dest);
            // src.on("end", function () {
            //     uploadFile(blobName);
            // });
        });
    }

    async genetic() {
        var start = new Date();
        this.algorithm.resetPopulation();

        try {
            // await this.createReportFile();
            // await this.createTimeReportFile();
            // await this.writeFileHeader();
            // await this.writeFileSecondsHeader();

            while (generation <= MAX_GENERATIONS) {
                this.algorithm.run();
                // await this.writeGenerationsOnFile();
                allChromosomes = [];
                generation++;
            }

            this.finalFitvalue = 0;
            var end = new Date();
            this.showCompositionInfo();
            // await this.writeSecondsOnFile(start, end, end.getTime() - start.getTime());            

        } catch (error) {
            throw Error(error);
        }

    }

    start(
        strategy,
        maxFitValue,
        populationSize,
        mutationChance,
        maxGenerations,
        currentExecution,
        bannedGenes,
        pickedGenes,
        enemyGenes
    ) {

        MAX_GENERATIONS = maxGenerations;
        COMPOSITION_STRATEGY = strategy;
        MAX_FIT_VALUE = maxFitValue;
        POPULATION_SIZE = populationSize;
        MUTATION_CHANCE = mutationChance;
        CURRENT_EXECUTION = currentExecution;
        ENEMY_GENES = enemyGenes;

        filePathReports =
            "app/reports/" +
            strategy +
            "/PS-" +
            populationSize +
            "__MC-" +
            mutationChance +
            "__MG-" +
            maxGenerations +
            ".csv";
        filePathTimeReports =
            "app/time-reports/" +
            strategy +
            "/PS-" +
            populationSize +
            "__MC-" +
            mutationChance +
            "__MG-" +
            maxGenerations +
            ".csv";

        let possibleGenes = Array.from({ length: totalChampions }, (v, k) => k + 1)
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

        fileName =
            Math.random()
                .toString(36)
                .substring(2, 15) +
            Math.random()
                .toString(36)
                .substring(2, 15);

        // for (var execution = 1; execution <= MAX_EXECUTIONS; execution++) {
        this.genetic(execution);
        // }
        return fileName;
    }
}

module.exports = new LeagueAlgorithm();
