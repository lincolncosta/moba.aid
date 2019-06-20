import { evolve, Chromosome } from "evolve-ga";
import * as json from './champions.json';

const solved = false;
const totalChampions = 141;

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

const selectionFunction = (chromosomes: Chromosome[]): Chromosome[] => {
    return chromosomes
        .sort((a: Chromosome, b: Chromosome): number => b.fitness - a.fitness)
        .slice(0, Math.ceil(chromosomes.length / 2));
}

const fitnessFunction = (chromosome: Chromosome) : number => {
    let fitvalue: any = 0;
    let attack = 0;
    let movspeed = 0;

    console.log(chromosome);

    attack = attack + chromosome['stats']['attackdamage'];
    movspeed = movspeed + chromosome['stats']['movespeed'];

    fitvalue = attack + movspeed;
    fitvalue = (fitvalue * 100 / 210).toFixed(2);


    return fitvalue;
}

const algorithm = evolve({
    populationSize: 10000,
    chromosomeLength: 5,
    possibleGenes: Array.apply(null, {length: totalChampions}).map(Number.call, Number),
    mutationChance: 0.1,
    fitnessFunction: fitnessFunction,
    selectionFunction: selectionFunction,
    crossOverFunction: crossOverFunction,
    mutationFunction: mutationFunction
});

while (!solved) {
    algorithm.run();
}