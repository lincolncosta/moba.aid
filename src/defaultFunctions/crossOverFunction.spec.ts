import { crossOverFunction } from './crossOverFunction';
import { Chromosome } from '../chromosome';

describe('CrossOver should return a new array equal in length', (): void => {
    test('length 0', (): void => {
        expect(crossOverFunction([])).toEqual([]);
    });
    test('length 1', (): void => {
        const ARRAY_LENGTH = 1;
        const inputArray: Chromosome[] = [];
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            inputArray.push({
                fitness: 0,
                genes: [0, 1, 2, 3, 4, 5]
            });
        }
        expect(crossOverFunction(inputArray).length).toBe(ARRAY_LENGTH);
    });
    test('length 50', (): void => {
        const ARRAY_LENGTH = 50;
        const inputArray: Chromosome[] = [];
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            inputArray.push({
                fitness: 0,
                genes: [0, 1, 2, 3, 4, 5]
            });
        }
        expect(crossOverFunction(inputArray).length).toBe(ARRAY_LENGTH);
    });
    test('length 947', (): void => {
        const ARRAY_LENGTH = 947;
        const inputArray: Chromosome[] = [];
        for (let i = 0; i < ARRAY_LENGTH; i++) {
            inputArray.push({
                fitness: 0,
                genes: [0, 1, 2, 3, 4, 5]
            });
        }
        expect(crossOverFunction(inputArray).length).toBe(ARRAY_LENGTH);
    });
});
