import { Chromosome } from '../chromosome';

export const mutationFunction = (chromosome: Chromosome, possibleGenes: (number | string)[]): Chromosome => {
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
