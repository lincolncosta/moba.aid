import { evolve, Chromosome } from "evolve-ga";
const json = require("./champions.json");
const fs = require("fs");

let generation = 0;
let finalChromosome: Chromosome;
let finalFitvalue = 0;

const totalChampions = 141;
const POPULATION_SIZE = 10;
const MUTATION_CHANCE = 0.3;
const MAX_GENERATIONS = 10;

const mutationFunction = (
  chromosome: Chromosome,
  possibleGenes: (number | string)[]
): Chromosome => {
  let mutatedGenes = [...chromosome.genes];
  const geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
  const possibleGenesFiltered = possibleGenes.filter(
    (gene: number | string): boolean => {
      return gene !== mutatedGenes[geneToMutateIndex];
    }
  );
  mutatedGenes[geneToMutateIndex] =
    possibleGenesFiltered[
      Math.floor(Math.random() * possibleGenesFiltered.length)
    ];

  let aux: Chromosome[] = [];
  aux[1] = {
    fitness: 0,
    genes: mutatedGenes
  };
  if (!validChromosome(aux[1])) {
    return {
      fitness: chromosome.fitness,
      genes: mutatedGenes
    };
  } else {
    return chromosome;
  }
};

const crossOverFunction = (chromosomes: Chromosome[]): Chromosome[] => {
  let offspring: Chromosome[] = [];
  let aux: Chromosome[] = [];
  for (let i = 0; i < chromosomes.length; i++) {
    const crossOverPoint = Math.floor(
      Math.random() * chromosomes[i].genes.length
    );
    const parentA = chromosomes[Math.floor(Math.random() * chromosomes.length)];
    const parentB = chromosomes[Math.floor(Math.random() * chromosomes.length)];

    aux[1] = {
      fitness: 0,
      genes: [
        ...parentA.genes.slice(0, crossOverPoint),
        ...parentB.genes.slice(crossOverPoint)
      ]
    };
    if (!validChromosome(aux[1])) {
      offspring.push({
        fitness: 0,
        genes: [
          ...parentA.genes.slice(0, crossOverPoint),
          ...parentB.genes.slice(crossOverPoint)
        ]
      });
    }
  }

  return offspring;
};

const selectionFunction = (chromosomes: Chromosome[]): Chromosome[] => {
  chromosomes = chromosomes
    .sort((a: Chromosome, b: Chromosome): number => b.fitness - a.fitness)
    .slice(0, Math.ceil(chromosomes.length / 2));

  chromosomes.map((chromosome, i) => {
    if (validChromosome(chromosome)) {
      chromosomes.splice(i, 1);
    }
  });
  return chromosomes;
};

const validCompositionFunction = (chromosome: Chromosome): boolean => {
  let validComposition = false;
  let hasCarry = false;
  let hasSupp = false;

  chromosome.genes.map(gene => {
    json.map(champion => {
      if (gene === champion.id) {
        champion.roles.map(role => {
          if(role === 'Support'){
            hasSupp = true;
          }
          if(role === 'Carry'){
            hasCarry = true;
          }
        })
      }

      if(hasCarry && hasSupp){
        validComposition = true;
      }
    })
  });

  return validComposition;
}

const fitnessFunction = (chromosome: Chromosome): number => {
  let validComposition = validCompositionFunction(chromosome);

  if(!validComposition){
    return 0;
  }

  switch(strategy){
    case 'gank':        
        let fitvalueGank: any = 0;
        let attack = 0;
        let movspeed = 0;
      
        chromosome.genes.map(gene => {
          json.map(champion => {
            if (gene === champion.id) {
              attack = attack + champion.stats.attackdamage;
              movspeed = movspeed + champion.stats.movespeed;
            }
          });
        });
      
        fitvalueGank = (attack + movspeed) / maxFitValue;
      
        if (fitvalueGank > finalFitvalue) {
          finalFitvalue = fitvalueGank;
          finalChromosome = chromosome;
        }
      
        return fitvalueGank;
    case 'teamfight':
        let fitvalueTeamfight: any = 0;
        let attackdamage = 0;
        let attackdamagelevel = 0;
        let healthpoints = 0;
      
        chromosome.genes.map(gene => {
          json.map(champion => {
            if (gene === champion.id) {
              attackdamage = attackdamage + champion.stats.attackdamage;
              attackdamagelevel = attackdamagelevel + champion.stats.attackdamagelevel;
              healthpoints = healthpoints + champion.stats.hp;
            }
          });
        });
      
        fitvalueTeamfight = (attackdamage + attackdamagelevel + healthpoints) / maxFitValue;;
      
        if (fitvalueTeamfight > finalFitvalue) {
          finalFitvalue = fitvalueTeamfight;
          finalChromosome = chromosome;
        }
      
        return fitvalueTeamfight;
    case 'pusher':
        let fitvaluePusher: any = 0;
        let attackdmg = 0;
        let attackrange = 0;
        let attackspeed = 0;
      
        chromosome.genes.map(gene => {
          json.map(champion => {
            if (gene === champion.id) {
              attackdmg = attackdmg + champion.stats.attackdamage;
              attackrange = attackrange + champion.stats.attackrange;
              attackspeed = attackspeed + champion.stats.attackspeedperlevel;
            }
          });
        });
      
        fitvaluePusher = (attackdmg + attackrange + attackspeed) / maxFitValue;
      
        if (fitvaluePusher > finalFitvalue) {
          finalFitvalue = fitvaluePusher;
          finalChromosome = chromosome;
        }
      
        return fitvaluePusher;
  }
};

const validChromosome = (chromosome: Chromosome): boolean => {
  let control = false;
  const { genes } = chromosome;

  genes.forEach(item => {
    let filteredArray = genes.filter(itemFilter => item === itemFilter);
    if (filteredArray.length > 1) {
      control = true;
    }
  });

  return control;
};

const algorithm = evolve({
  populationSize: POPULATION_SIZE,
  chromosomeLength: 5,
  possibleGenes: Array.apply(null, { length: totalChampions }).map(
    Number.call,
    Number
  ),
  mutationChance: MUTATION_CHANCE,
  fitnessFunction: fitnessFunction,
  selectionFunction: selectionFunction,
  crossOverFunction: crossOverFunction,
  mutationFunction: mutationFunction
});

const strategy = process.argv[2];
const maxFitValue = parseInt(process.argv[3]);

const showCompositionInfo = () => {
  console.log("COMPOSIÇÃO FINAL");
  const parsedJson = JSON.parse(JSON.stringify(json));
  finalChromosome.genes.forEach(item => {
    const aux = parsedJson.find(champion => champion.id === item);
    if (aux) {
      console.log(aux.localized_name);
    }
  });
  console.log("----------------");
};

const numberCompare = (a, b) => {
  return a - b;
};

const filePath = `reports/PS-${POPULATION_SIZE}__MC-${MUTATION_CHANCE}__MG-${MAX_GENERATIONS}.csv`;
fs.writeFile(filePath, "", () => {
  console.log("File manipulation end.");
});

//for (let i = 0; i < 100; i++) {
  while (finalFitvalue < maxFitValue && generation < MAX_GENERATIONS) {
    console.log(finalFitvalue);
    generation++;
    algorithm.run();
  }

  showCompositionInfo();

  finalChromosome = null;
  finalFitvalue = 0;
  generation = 0;
//}
