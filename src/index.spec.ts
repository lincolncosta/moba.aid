import { evolve } from "./index";
import { UserConfig } from './config/userConfig';
import { GeneticAlgorithm } from './geneticAlgorithm';

test('Export function which returns a GeneticAlgorithm instance', (): void => {
    const config: UserConfig = {
        fitnessFunction: (): number => { return 0 }
    }
    expect(evolve(config)).toMatchObject(new GeneticAlgorithm(config));
});
