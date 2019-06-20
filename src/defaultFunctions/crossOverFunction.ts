import { Chromosome } from '../chromosome';

export const crossOverFunction = (chromosomes: Chromosome[]): Chromosome[] => {
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
