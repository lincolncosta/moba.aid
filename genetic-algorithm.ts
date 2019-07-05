import { evolve, Chromosome } from "evolve-ga";
import * as json from "./champions.json";
const fs = require('fs');


let solved = false;
let generation = 0;
let finalChromosome: Chromosome;
let finalFitvalue = 0;
const maxGenerations = 1000;
const maxFitValue = 210;
const totalChampions = 141;

const mutationFunction = (
	chromosome: Chromosome,
	possibleGenes: (number | string)[]
): Chromosome => {
	let mutatedGenes = [...chromosome.genes];
	const geneToMutateIndex = Math.floor(Math.random() * mutatedGenes.length);
	const possibleGenesFiltered = possibleGenes.filter(
		(gene: number | string): boolean => {
			return gene !== mutatedGenes[geneToMutateIndex];
		}
	);
	mutatedGenes[geneToMutateIndex] =
		possibleGenesFiltered[
		Math.floor(Math.random() * possibleGenesFiltered.length)
		];
	return {
		fitness: chromosome.fitness,
		genes: mutatedGenes
	};
};

const crossOverFunction = (chromosomes: Chromosome[]): Chromosome[] => {
	let offspring: Chromosome[] = [];
	let aux: Chromosome[] = [];
	for (let i = 0; i < chromosomes.length; i++) {
		const crossOverPoint = Math.floor(
			Math.random() * chromosomes[i].genes.length
		);
		const parentA = chromosomes[Math.floor(Math.random() * chromosomes.length)];
		const parentB = chromosomes[Math.floor(Math.random() * chromosomes.length)];

		aux[1] = {
			fitness: 0,
			genes: [
				...parentA.genes.slice(0, crossOverPoint),
				...parentB.genes.slice(crossOverPoint)
			]
		};

		if (!validChromosome(aux[1])) {
			offspring.push({
				fitness: 0,
				genes: [
					...parentA.genes.slice(0, crossOverPoint),
					...parentB.genes.slice(crossOverPoint)
				]
			});
		}
	}

	return offspring;
};

const selectionFunction = (chromosomes: Chromosome[]): Chromosome[] => {
	chromosomes = chromosomes
		.sort((a: Chromosome, b: Chromosome): number => b.fitness - a.fitness)
		.slice(0, Math.ceil(chromosomes.length / 2));

	chromosomes.map((chromosome, i) => {
		if (validChromosome(chromosome)) {
			chromosomes.splice(i, 1);
		}
	});
	return chromosomes;
};

const fitnessFunction = (chromosome: Chromosome): number => {
	let fitvalue: any = 0;
	let attack = 0;
	let movspeed = 0;
	let fighter = 0;

	chromosome.genes.map(gene => {
		json.map(champion => {
			if (gene === champion.id) {
				attack = attack + champion.stats.attackdamage;
				movspeed = movspeed + champion.stats.movespeed;
			}

			champion.roles.map(role => {
				if(role == 'Fighter'){
					fighter = 10;
				}
			})
		});
	});

	fitvalue = attack + movspeed + fighter;
		fitvalue = ((fitvalue * 100) / 2075).toFixed(2);

		if (fitvalue > finalFitvalue) {
			finalFitvalue = fitvalue;
			finalChromosome = chromosome;
		}
	return fitvalue;
};

const validChromosome = (chromosome: Chromosome): boolean => {
	debugger;
	let control = false;
	const { genes } = chromosome;

	genes.forEach(item => {
		let filteredArray = genes.filter(itemFilter => item === itemFilter);
		if (filteredArray.length > 1) {
			control = true;
		}
	});

	return control;
};

const algorithm = evolve({
	populationSize: 300,
	chromosomeLength: 5,
	possibleGenes: Array.apply(null, { length: totalChampions }).map(
		Number.call,
		Number
	),
	mutationChance: 0.7,
	fitnessFunction: fitnessFunction,
	selectionFunction: selectionFunction,
	crossOverFunction: crossOverFunction,
	mutationFunction: mutationFunction
});

const showCompositionInfo = () => {
	console.log("COMPOSIÇÃO FINAL");
	const parsedJson = JSON.parse(JSON.stringify(json));
	finalChromosome.genes.forEach(item => {
		const aux = parsedJson.find(champion => champion.id === item);
		if (aux) {
			console.log(aux.localized_name);
		}

	});
	console.log("----------------");
};

for(let i=0; i<100; i++){
	while (finalFitvalue < 210 && generation < maxGenerations) {
		generation++;
		algorithm.run();
	}

	fs.appendFileSync('result.txt', finalChromosome.genes.toString() + '\r\n');
	finalChromosome = null;
	finalFitvalue = 0;
	generation = 0;
}