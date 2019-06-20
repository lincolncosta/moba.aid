import { fitnessFunction } from './fitnessFunction';

test('Default Fitness Function should return 0', (): void => {
    expect(fitnessFunction()).toBe(0);
});
