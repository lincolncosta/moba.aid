import { mutationFunction } from '../defaultFunctions/mutationFunction';
import { crossOverFunction } from '../defaultFunctions/crossOverFunction';
import { selectionFunction } from '../defaultFunctions/selectionFunction';
import { fitnessFunction } from '../defaultFunctions/fitnessFunction';
import { Config } from './config';

export const defaultConfig: Config = {
    fitnessFunction: fitnessFunction,
    selectionFunction: selectionFunction,
    crossOverFunction: crossOverFunction,
    mutationFunction: mutationFunction,
    populationSize: 10000,
    chromosomeLength: 100,
    possibleGenes: [0, 1, 2, 3],
    mutationChance: 0.1
}
