var fs = require("fs");
var json = require("../champions.json");

class RandomicAlgorithm {

  constructor (){
    this.randomic = this.randomic.bind(this)
  }

  generateRandomPosition () {
    return Math.floor(Math.random() * 141) + 1;
  };

  randomic () {
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
        chromosome.push(control);
    }
    fs.appendFileSync("reports/randomic.csv", chromosome + "\t fit = " + finalFitness.toFixed(2) + "\r\n");
  };
  start () {
    for (var x = 0; x < 100; x++) {
      this.randomic();
    }
  }
}

module.exports = new RandomicAlgorithm()