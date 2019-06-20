import { fitnessFunction } from './defaultFunctions/fitnessFunction';
import { mutationFunction } from './defaultFunctions/mutationFunction';
import { selectionFunction } from './defaultFunctions/selectionFunction';
import { crossOverFunction } from './defaultFunctions/crossOverFunction';
import { GeneticAlgorithm } from './geneticAlgorithm';

describe('GeneticAlgorithm should', (): void => {
    const CHROMOSOME_LENGTH = 10;
    const POPULATION_SIZE = 10;
    const MUTATION_CHANCE = 1;
    const POSSIBLE_GENES = [0, 1, 2, 3, 4, 5];
    const mockFitness = jest.fn(fitnessFunction);
    const mockMutation = jest.fn(mutationFunction);
    const mockSelection = jest.fn(selectionFunction);
    const mockCrossOver = jest.fn(crossOverFunction);
    test('call functions', (): void => {
        const algo = new GeneticAlgorithm({
            chromosomeLength: CHROMOSOME_LENGTH,
            populationSize: POPULATION_SIZE,
            mutationChance: MUTATION_CHANCE,
            possibleGenes: POSSIBLE_GENES,
            fitnessFunction: mockFitness,
            crossOverFunction: mockCrossOver,
            mutationFunction: mockMutation,
            selectionFunction: mockSelection
        });

        algo.run();
        expect(mockFitness).toBeCalledTimes(POPULATION_SIZE);
        expect(mockSelection).toBeCalledTimes(0);
        expect(mockCrossOver).toBeCalledTimes(0);
        expect(mockMutation).toBeCalledTimes(0);

        algo.run();
        expect(mockFitness).toBeCalled();
        expect(mockSelection).toBeCalled();
        expect(mockCrossOver).toBeCalled();
        expect(mockMutation).toBeCalled();

        mockCrossOver.mockClear();
        mockSelection.mockClear();
        algo.resetPopulation();
        algo.run();
        expect(mockSelection).toBeCalledTimes(0);
        expect(mockCrossOver).toBeCalledTimes(0);
    });
});
