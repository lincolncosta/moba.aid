var fs = require("fs");
var json = jsonLeague = require("./assets/league/champions.json");

class LeagueRandomicAlgorithm {

  constructor() {
    this.randomic = this.randomic.bind(this)
  }

  generateRandomPosition() {
    return Math.floor(Math.random() * 141) + 1;
  };

  randomic() {
    var chromosome = [];
    var control = 0;
    var current;
    var finalFitness = 0;
    for (var x = 0; x < 5; x++) {
      while (chromosome.find(function (item) { return item === control; }) || control === 0) {
        current = json[this.generateRandomPosition()];
        if (current)
          control = current.id;
      }
      finalFitness += current.stats.attackdamage + current.stats.movespeed;

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

      chromosome.push(control);
    }

    return new Promise(function (resolve, reject) {
      fs.appendFile("app/reports/randomic.csv", chromosome + "\t fit = " + finalFitness.toFixed(2) + "\r\n");
    });

  };

  start() {
    for (var x = 0; x < 100; x++) {
      this.randomic();
    }
  }
}

module.exports = new LeagueRandomicAlgorithm()