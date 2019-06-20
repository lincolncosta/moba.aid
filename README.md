[![Build Status](https://travis-ci.org/KoenKamman/evolve-ga.svg?branch=master)](https://travis-ci.org/KoenKamman/evolve-ga)
[![Coverage Status](https://coveralls.io/repos/github/KoenKamman/evolve-ga/badge.svg?branch=master)](https://coveralls.io/github/KoenKamman/evolve-ga?branch=master)
![npm](https://img.shields.io/npm/v/evolve-ga.svg)

# Evolve - Genetic Algorithm
Simple implementation of a Genetic Algorithm.

## Installation
Install it with NPM:
```
npm i evolve-ga
```

Download from the releases section and include it on a webpage:
```html
<script src="dist/evolve-ga.iife.min.js"></script>
```

Include it via CDN:
```html
<script src="https://unpkg.com/evolve-ga@2.0.0/dist/evolve-ga.iife.min.js"></script>
```

## Usage
```typescript
import { evolve } from "evolve-ga";
const algorithm = evolve(config);
evolve.run();
```
Provide a config object to the evolve method, After which the run method can be used to create a new generation of candidate solutions. All configuration parameters are optional and have defaults provided for them, except for the Fitness Function.

When running the algorithm for the first time, it will generate a random population of chromosomes and determine their fitness value. Each consecutive run will select the fittest chromosomes from the population, use them to generate offspring, mutate the offspring, and add the surviving population and offspring together to create the new population. Afterwards the fitness values of the new population will be calculated.

## Configuration
```typescript
import { evolve } from "evolve-ga";

const algorithm = evolve({
    populationSize: 10000,
    chromosomeLength: 100,
    possibleGenes: [0, 1, 2, 3],
    mutationChance: 0.1,
    fitnessFunction: fitnessFunction,
    selectionFunction: selectionFunction,
    crossOverFunction: crossOverFunction,
    mutationFunction: mutationFunction
});
```
- **Population Size:** The amount of chromosomes the initial population should consist of.
- **Chromosome Length:** The amount of genes a chromosome should contain.
- **Possible Genes:** An array of strings or numbers. These values are used to generate and mutate chromosomes.
- **Mutation Chance:** A number between 0 and 1. The higher the number, the higher the chance of a mutation occuring.

### Fitness Function
The function that's used to determine a chromosomes fitness value. It receives a chromosome as parameter and returns a number (fitness value).

Signature:
```typescript
(chromosome: Chromosome) => number
```

### Selection Function
The function that's used for selecting chromosomes to keep for the next generation and to generate offspring with. It receives the current population and returns an array of the fittest chromosomes.

Signature:
```typescript
(chromosomes: Chromosome[]) => Chromosome[]
```
The default Selection Function is as follows:
```typescript
const selectionFunction = (chromosomes: Chromosome[]): Chromosome[] => {
    return chromosomes
        .sort((a: Chromosome, b: Chromosome): number => b.fitness - a.fitness)
        .slice(0, Math.ceil(chromosomes.length / 2));
    }
}
```

### CrossOver Function
The function that's used for generating offspring from selected chromosomes. It receives the chromosomes that resulted from the Selection Function and returns an array of offspring.

Signature:
```typescript
(chromosomes: Chromosome[]) => Chromosome[]
```
The default CrossOver Function is as follows:
```typescript
const crossOverFunction = (chromosomes: Chromosome[]): Chromosome[] => {
    let offspring: Chromosome[] = [];
    for (let i = 0; i < chromosomes.length; i++) {
        const crossOverPoint = Math.floor(Math.random() * chromosomes[i].genes.length);
        const parentA = chromosomes[Math.floor(Math.random() * chromosomes.length)];
        const parentB = chromosomes[Math.floor(Math.random() * chromosomes.length)];
        offspring[i] = {
            fitness: 0,
            genes: [...parentA.genes.slice(0, crossOverPoint), ...parentB.genes.slice(crossOverPoint)]
        }
    }
    return offspring;
}
```

### Mutation Function
The function that's used for mutating chromosomes. It receives chromosomes that result from the CrossOver Function and trigger a mutation, and returns a mutated chromosome.

Signature:
```typescript
(chromosome: Chromosome, possibleGenes: (number | string)[]) => Chromosome
```
The default Mutation Function is as follows:
```typescript
const mutationFunction = (chromosome: Chromosome, possibleGenes: (number | string)[]): Chromosome => {
    let mutatedGenes = [...chromosome.genes];
    const geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
    const possibleGenesFiltered = possibleGenes.filter((gene: (number | string)): boolean => {
        return gene !== mutatedGenes[geneToMutateIndex];
    });
    mutatedGenes[geneToMutateIndex] = possibleGenesFiltered[
        Math.floor(Math.random() * possibleGenesFiltered.length)
    ];
    return {
        fitness: chromosome.fitness,
        genes: mutatedGenes
    }
}
```

## Typescript Example
```typescript
import { evolve, Chromosome, GeneticAlgorithm } from "evolve-ga";

const target = ['A', 'B', 'A', 'B', 'A', 'B', 'A'];
let solved = false;

const algorithm: GeneticAlgorithm = evolve({
    possibleGenes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    chromosomeLength: target.length,
    fitnessFunction: (chromosome: Chromosome): number => {
        let fitness = 0;
        for (let i = 0; i < target.length; i++) {
            if (target[i] === chromosome.genes[i]) {
                fitness += 1;
            }
        }
        if (fitness === target.length) {
            solved = true;
        }
        return fitness;
    }
});

while (!solved) {
    algorithm.run();
}

```
