import { Chromosome } from '../chromosome';

export const selectionFunction = (chromosomes: Chromosome[]): Chromosome[] => {
    return chromosomes
        .sort((a: Chromosome, b: Chromosome): number => b.fitness - a.fitness)
        .slice(0, Math.ceil(chromosomes.length / 2));
}
