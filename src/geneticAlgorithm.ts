import { defaultConfig } from './config/defaultConfig';
import { Config } from './config/config';
import { Chromosome } from './chromosome';
import { UserConfig } from './config/userConfig';

export class GeneticAlgorithm {
    private config: Config;
    private population: Chromosome[];

    public constructor(config: UserConfig) {
        this.config = { ...defaultConfig, ...config };
        this.population = [];
    }

    public run(): Chromosome[] {
        if (this.population.length === 0) {
            this.createInitialPopulation();
        } else {
            this.createNewGeneration(this.population);
        }
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].fitness = this.config.fitnessFunction(this.population[i]);
        }
        return [...this.population];
    }

    public resetPopulation(): void {
        this.population = [];
    }

    private createInitialPopulation(): void {
        this.population = [...Array(this.config.populationSize)].map((): Chromosome => {
            return {
                fitness: 0,
                genes: [...Array(this.config.chromosomeLength)].map((): (number | string) => {
                    return this.config.possibleGenes[Math.floor(Math.random() * this.config.possibleGenes.length)];
                })
            }
        });
    }

    private createNewGeneration(population: Chromosome[]): void {
        const selectedChromosomes = this.config.selectionFunction(population);
        const offspring = this.config.crossOverFunction(selectedChromosomes);
        for (let i = 0; i < offspring.length; i++) {
            if (this.config.mutationChance >= Math.random()) {
                offspring[i] = this.config.mutationFunction(offspring[i], this.config.possibleGenes);
            }
        }
        this.population = [...selectedChromosomes, ...offspring];
    }
}
