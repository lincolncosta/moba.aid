from app.geneticalgorithm.FitnessFunction import order_next_picks
from FitnessFunction import fitness_function
from CreateIndividual import create_population
from Utils import *
from Dataset import Dataset
import random
from random import randint
import itertools


POP_SIZE = 30  # population
GENOME_SIZE = 5  # number of genes
MAX_TOURNAMENT = 3  # selection method
MAX_GENERATIONS = 50  # number of generation
PROB_MUTATION = 0.3  # mutation
MAX_EXECUTION_WITHOUT_IMPROV = 5
NEXT_PICKS = []

# selection method


def selection_method(population, ENEMY_HEROES):
    tournament = [random.choice(population) for _ in range(MAX_TOURNAMENT)]
    fitnesses = [fitness_function(tournament[i], ENEMY_HEROES)
                 for i in range(MAX_TOURNAMENT)]
    return tournament[fitnesses.index(max(fitnesses))]


# crossover one point
# [0,1,2,3] + [6,7,8,9] -> [0,1,8,9] - [6,7,2,3] (SE O CORTE FOR NO MEIO)
def crossover(pai1, pai2):
    corte = randint(1, GENOME_SIZE-1)
    filho1 = pai1[:corte] + pai2[corte:]
    filho2 = pai2[:corte] + pai1[corte:]
    return [filho1, filho2]

# mutation one point


def mutation(individual):
    if random.random() <= PROB_MUTATION:
        individual = mutation_traditional(individual)

    return(individual)


def mutation_traditional(individual):
    for i in range(GENOME_SIZE):
        if i == 0:
            individual[0] = Dataset.top['id'][randint(0, len(Dataset.top)-1)]
        elif i == 1:
            individual[1] = Dataset.jungler['id'][randint(
                0, len(Dataset.jungler)-1)]
        elif i == 2:
            individual[2] = Dataset.mid['id'][randint(0, len(Dataset.mid)-1)]
        else:
            individual[3] = Dataset.carry['id'][randint(
                0, len(Dataset.carry)-1)]
    return (individual)


def run_ga(NEEDED_RETURN_SIZE, ENEMY_HEROES=[], PICKED_HEROES={}, BANNED_HEROES=[]):

    global NEXT_PICKS
    EXECUTION_WITHOUT_IMPROV_COUNTER = 0

    best_global_fit = 0

    population = create_population(POP_SIZE, PICKED_HEROES, BANNED_HEROES)

    # Início do AG
    for _ in range(MAX_GENERATIONS):

        if (MAX_EXECUTION_WITHOUT_IMPROV == EXECUTION_WITHOUT_IMPROV_COUNTER):
            orderCompositionDict = order_next_picks(
                best_individual[0], best_individual[1], best_individual[2], best_individual[3], best_individual[4], ENEMY_HEROES)
            NEXT_PICKS = dict(itertools.islice(
                orderCompositionDict.items(), NEEDED_RETURN_SIZE))
            return NEXT_PICKS

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
            # selection individuols more apts
            # prisoners_dilemma(population)
            pai1 = selection_method(population, ENEMY_HEROES)
            pai2 = selection_method(population, ENEMY_HEROES)
            # Produz novos indivíduos
            filhos = crossover(pai1, pai2)
            # Executa mutação
            next_generation.append(mutation(filhos[0]))
            next_generation.append(mutation(filhos[1]))
            # TO-DO FEATURE: Incluir verificador que obrigue que PICKED_HEROES estejam presentes nos processos de cruzamento e mutação,
            # ao mesmo tempo que garanta que BANNED_HEROES não estejam nesses processos.

        population = next_generation

    return NEXT_PICKS
