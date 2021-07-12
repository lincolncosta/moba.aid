from app.geneticalgorithm.FitnessFunction import order_next_picks
from FitnessFunction import fitness_function
from CreateIndividual import create_population
from Utils import *
from Dataset import Dataset
import random
from random import randint
from random import choice
import itertools
import time


POP_SIZE = 30  # population
GENOME_SIZE = 5  # number of genes
MAX_TOURNAMENT = 3  # selection method
PROB_MUTATION = 0.3  # mutation
NEXT_PICKS = []


def selection_method(population, ENEMY_HEROES):
    tournament = [random.choice(population) for _ in range(MAX_TOURNAMENT)]
    fitnesses = [fitness_function(tournament[i], ENEMY_HEROES)
                 for i in range(MAX_TOURNAMENT)]
    return tournament[fitnesses.index(max(fitnesses))]


def crossover(pai1, pai2):
    corte = randint(1, GENOME_SIZE-1)
    filho1 = pai1[:corte] + pai2[corte:]
    filho2 = pai2[:corte] + pai1[corte:]
    return [filho1, filho2]


def mutation(individual, PICKED_HEROES, BANNED_HEROES):
    if random.random() <= PROB_MUTATION:
        individual = mutation_traditional(individual, PICKED_HEROES, BANNED_HEROES)

    return(individual)


def mutation_traditional(individual, PICKED_HEROES, BANNED_HEROES):
    for i in range(GENOME_SIZE):
        if i == 0:
            individual[0] = PICKED_HEROES['top'] if 'top' in PICKED_HEROES else Dataset.top['id'][choice([i for i in range(0, len(Dataset.top)) if i not in BANNED_HEROES])]
        elif i == 1:
            PICKED_HEROES['jungler'] if 'jungler' in PICKED_HEROES else Dataset.jungler['id'][choice([i for i in range(0, len(Dataset.jungler)) if i not in BANNED_HEROES])]
        elif i == 2:
            PICKED_HEROES['mid'] if 'mid' in PICKED_HEROES else Dataset.mid['id'][choice([i for i in range(0, len(Dataset.mid)) if i not in BANNED_HEROES])]
        elif i == 3:
            PICKED_HEROES['adc'] if 'adc' in PICKED_HEROES else Dataset.adc['id'][choice([i for i in range(0, len(Dataset.adc)) if i not in BANNED_HEROES])]
        elif i == 4:
            PICKED_HEROES['support'] if 'support' in PICKED_HEROES else Dataset.support['id'][choice([i for i in range(0, len(Dataset.support)) if i not in BANNED_HEROES])]
    return (individual)


def run_ga(NEEDED_RETURN_SIZE, ENEMY_HEROES=[], PICKED_HEROES={}, BANNED_HEROES=[]):

    global NEXT_PICKS
    EXECUTION_WITHOUT_IMPROV_COUNTER = 0
    start_time = time.time()
    execution_time = 0
    best_global_fit = 0

    population = create_population(POP_SIZE, PICKED_HEROES, BANNED_HEROES)

    # Início do AG
    while execution_time < 10:        
        best_individual = []
        fit_best_individual = 0

        current_best_fit = best_global_fit
        for individual in population:

            fit = fitness_function(
                individual, ENEMY_HEROES)
            if fit > fit_best_individual:
                fit_best_individual = fit
                best_individual = individual
            if fit > best_global_fit:
                best_global_fit = fit
        
        if current_best_fit == best_global_fit:
            EXECUTION_WITHOUT_IMPROV_COUNTER = EXECUTION_WITHOUT_IMPROV_COUNTER + 1

        next_generation = []

        # Inicia seleção, crossover e mutação
        for _ in range(int(POP_SIZE/2)):
            # Seleciona indivíduos mais aptos
            pai1 = selection_method(population, ENEMY_HEROES)
            pai2 = selection_method(population, ENEMY_HEROES)
            # Produz novos indivíduos
            filhos = crossover(pai1, pai2)
            # Executa mutação
            next_generation.append(mutation(filhos[0], PICKED_HEROES, BANNED_HEROES))
            next_generation.append(mutation(filhos[1], PICKED_HEROES, BANNED_HEROES))
            # TO-DO FEATURE: Incluir verificador que obrigue que PICKED_HEROES estejam presentes nos processos de cruzamento.

        population = next_generation
        execution_time = time.time() - start_time

    orderCompositionDict = order_next_picks(best_individual[0], best_individual[1], best_individual[2], best_individual[3], best_individual[4])
    for lane in PICKED_HEROES.keys():
        del orderCompositionDict[lane]
    NEXT_PICKS = dict(itertools.islice(
        orderCompositionDict.items(), NEEDED_RETURN_SIZE))
    return NEXT_PICKS
