class GeneticAlgorithm {
  constructor() {
    this.crossOverFunction = this.crossOverFunction.bind(this);
    this.mutationFunction = this.mutationFunction.bind(this);
    this.selectionFunction = this.selectionFunction.bind(this);
    this.validChromosome = this.validChromosome.bind(this);
  }

  mutationFunction(chromosome, possibleGenes) {
    var mutatedGenes = chromosome.genes.slice();
    var geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
    var possibleGenesFiltered = possibleGenes.filter(function (gene) {
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
      .sort(function (a, b) {
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

    genes.forEach(function (item) {
      var filteredArray = genes.filter(function (itemFilter) {
        return item === itemFilter;
      });
      if (filteredArray.length > 1) {
        control = true;
      }
    });

    return control;
  }
}

module.exports = GeneticAlgorithm;
