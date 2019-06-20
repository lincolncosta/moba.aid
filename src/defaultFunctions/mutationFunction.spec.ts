import { mutationFunction } from './mutationFunction';
import { Chromosome } from '../chromosome';

describe('Mutate should return a new chromosome', (): void => {
    const possibleGenes = [0, 1, 2];
    const chromosome: Chromosome = {
        fitness: 0,
        genes: [0, 1, 2, 1, 0, 1]
    }
    test('with one gene changed', (): void => {
        const mutatedGenes = mutationFunction(chromosome, possibleGenes).genes;
        let geneDifferences = 0;
        for (let i = 0; i < mutatedGenes.length; i++) {
            if (chromosome.genes[i] !== mutatedGenes[i]) {
                geneDifferences += 1;
            }
        }
        expect(geneDifferences).toBe(1);
    });
    test('with an equal amount of genes', (): void => {
        const mutatedChromosome = mutationFunction(chromosome, possibleGenes);
        expect(mutatedChromosome.genes.length)
            .toEqual(chromosome.genes.length);
    });
});
