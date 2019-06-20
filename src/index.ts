import { GeneticAlgorithm } from './geneticAlgorithm';
import { UserConfig } from './config/userConfig';

const evolve = (config: UserConfig): GeneticAlgorithm => new GeneticAlgorithm(config);

export { evolve, GeneticAlgorithm };
export * from './chromosome';
export * from './config/userConfig';
