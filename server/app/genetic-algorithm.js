var evolveGa = require('evolve-ga');
var createCollage = require('@settlin/collage');
var json = require('./assets/league/champions.json');
var fs = require('fs');
// const uploadFile = require("./uploadFile");
let generation = 1;
let execution = 1;
let finalFitvalue = 0;
let allChromosomes = [];
let totalChampions = 146;
let POPULATION_SIZE;
let MUTATION_CHANCE;
let MAX_GENERATIONS;
let MAX_EXECUTIONS = 3;
let COMPOSITION_STRATEGY;
let MAX_FIT_VALUE = 81.28;
let CURRENT_EXECUTION;
var fileName = '';
let filePathReports = '';
let filePathTimeReports = '';

class GeneticAlgorithm {
  constructor() {
    this.genetic = this.genetic.bind(this);

    this.crossOverFunction = this.crossOverFunction.bind(this);
    this.mutationFunction = this.mutationFunction.bind(this);
    this.selectionFunction = this.selectionFunction.bind(this);

    this.validChromosome = this.validChromosome.bind(this);
  }

  mutationFunction(chromosome, possibleGenes) {
    var mutatedGenes = chromosome.genes.slice();
    var geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
    var possibleGenesFiltered = possibleGenes.filter(function(gene) {
      return gene !== mutatedGenes[geneToMutateIndex];
    });
    mutatedGenes[geneToMutateIndex] =
      possibleGenesFiltered[
        Math.floor(Math.random() * possibleGenesFiltered.length)
      ];
    var aux = [];
    aux[1] = {
      fitness: 0,
      genes: mutatedGenes,
    };

    if (!this.validChromosome(aux[1])) {
      return {
        fitness: chromosome.fitness,
        genes: mutatedGenes,
      };
    } else {
      return chromosome;
    }
  }

  crossOverFunction(chromosomes) {
    var offspring = [];
    var aux = [];

    for (var i = 0; i < chromosomes.length; i++) {
      var crossOverPoint = Math.floor(
        Math.random() * chromosomes[i].genes.length,
      );
      var parentA = chromosomes[Math.floor(Math.random() * chromosomes.length)];
      var parentB = chromosomes[Math.floor(Math.random() * chromosomes.length)];
      aux[1] = {
        fitness: 0,
        genes: parentA.genes
          .slice(0, crossOverPoint)
          .concat(parentB.genes.slice(crossOverPoint)),
      };
      if (!this.validChromosome(aux[1])) {
        offspring.push({
          fitness: 0,
          genes: parentA.genes
            .slice(0, crossOverPoint)
            .concat(parentB.genes.slice(crossOverPoint)),
        });
      }
    }

    return offspring;
  }

  selectionFunction(chromosomes) {
    chromosomes = chromosomes
      .sort(function(a, b) {
        return b.fitness - a.fitness;
      })
      .slice(0, Math.ceil(chromosomes.length / 2));
    chromosomes.map((chromosome, i) => {
      if (this.validChromosome(chromosome)) {
        chromosomes.splice(i, 1);
      }
    });
    return chromosomes;
  }

  validChromosome(chromosome) {
    var control = false;
    var genes = chromosome.genes;

    genes.forEach(function(item) {
      var filteredArray = genes.filter(function(itemFilter) {
        return item === itemFilter;
      });
      if (filteredArray.length > 1) {
        control = true;
      }
    });

    return control;
  }

  writeSecondsOnFile(start, end, duration) {
    return new Promise(function(resolve, reject) {
      fs.appendFile(
        filePathTimeReports,
        CURRENT_EXECUTION + ';' + start + ';' + end + ';' + duration + ' \r\n',
        function(err) {
          if (err) {
            // return console.log(err);
          }

          // console.log("The file was saved!");
        },
      );
    });
  }

  createReportFiles() {
    fs.writeFile(filePathReports, '', function() {});
    fs.writeFile(filePathTimeReports, '', function() {});
  }

  async genetic() {
    var start = new Date();
    this.algorithm.resetPopulation();

    try {
      await this.createReportFile();
      await this.createTimeReportFile();
      // await this.writeFileHeader();
      // await this.writeFileSecondsHeader();

      while (generation <= MAX_GENERATIONS) {
        this.algorithm.run();
        await this.writeGenerationsOnFile();
        allChromosomes = [];
        generation++;
      }

      this.finalFitvalue = 0;
      var end = new Date();
      // this.showCompositionInfo();
      await this.writeSecondsOnFile(
        start,
        end,
        end.getTime() - start.getTime(),
      );
    } catch (error) {
      throw Error(error);
    }
  }

  writeFileHeader() {
    return new Promise(function(resolve, reject) {
      fs.appendFile(
        filePathReports,
        'execution;generation;chromosome;fitness \r\n',
        function(err) {
          if (err) {
            return reject(err);
          }

          resolve(true);
        },
      );
    });
  }

  writeFileSecondsHeader() {
    return new Promise(function(resolve, reject) {
      fs.appendFile(
        filePathTimeReports,
        'execution;start;end;duration \r\n',
        function(err) {
          if (err) {
            return reject(err);
          }

          resolve(true);
        },
      );
    });
  }

  writeGenerationsOnFile() {
    return new Promise(function(resolve, reject) {
      var self = this;
      let chromosome = allChromosomes[0];
      // allChromosomes.map((chromosome, self) => {
      fs.appendFile(
        filePathReports,
        CURRENT_EXECUTION +
          ';' +
          generation +
          ';' +
          chromosome.genes.toString() +
          ';' +
          chromosome.fitness +
          '\r\n',
        function(err) {
          if (err) {
            return reject(err);
          }

          resolve(true);
        },
      );
      // });
    });
  }

  createReportFile() {
    return new Promise(function(resolve, reject) {
      fs.appendFile(filePathReports, '', function() {
        resolve(true);
      });
    });
  }

  createTimeReportFile() {
    return new Promise(function(resolve, reject) {
      fs.appendFile(filePathTimeReports, '', function() {
        resolve(true);
      });
    });
  }
}

module.exports = GeneticAlgorithm;
