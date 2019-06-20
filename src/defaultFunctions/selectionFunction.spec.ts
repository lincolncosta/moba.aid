import { selectionFunction } from './selectionFunction';
import { Chromosome } from '../chromosome';

describe('Selection should return a new array', (): void => {
    test('sorted by fitness', (): void => {
        const ARRAY_LENGTH = 10;
        const inputArray: Chromosome[] = [];
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            inputArray.push({
                fitness: Math.random(),
                genes: [0, 1, 2, 3, 4, 5]
            });
        }
        const selectedChromosomes = selectionFunction(inputArray);
        let isSorted = true;
        for (let i = 0; i < selectedChromosomes.length - 1 && isSorted; i++) {
            isSorted = selectedChromosomes[i].fitness > selectedChromosomes[i + 1].fitness;
        }
        expect(isSorted).toBe(true);
    });

    test('half the length of the input array, rounded up', (): void => {
        const ARRAY_LENGTH = 17;
        const inputArray: Chromosome[] = [];
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            inputArray.push({
                fitness: 0,
                genes: [0, 1, 2, 3, 4, 5]
            });
        }
        const selectedChromosomes = selectionFunction(inputArray);
        expect(selectedChromosomes.length).toBe(Math.ceil(ARRAY_LENGTH / 2));
    });
});
