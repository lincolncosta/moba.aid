from FitnessFunction import fitness_function
from CreateIndividual import create_population
from Utils import *
import random
from random import randint
import itertools
import pandas as pd

df = pd.read_csv('assets/dataset/dataset.csv')

# types of role
top = df.loc[df.lanes.str.contains('Top')]
jungler = df.loc[df.lanes.str.contains('Jungler')]
mid = df.loc[df.lanes.str.contains('Mid')]
carry = df.loc[df.lanes.str.contains('Carry')]
support = df.loc[df.lanes.str.contains('Support')]

# get pandas and reordena indices
top.index = range(len(top.index))
jungler.index = range(len(jungler.index))
mid.index = range(len(mid.index))
carry.index = range(len(carry.index))
support.index = range(len(support.index))

POP_SIZE = 30  # population
GENOME_SIZE = 5  # number of genes
MAX_TOURNAMENT = 3  # selection method
MAX_GENERATIONS = 50  # number of generation
PROB_MUTATION = 0.3  # mutation
MAX_EXECUTION_WITHOUT_IMPROV = 5
COMPOSITION_STRATEGY = ''
NEXT_PICKS = []

# selection method


def selection_method(population, ENEMY_HEROES):
    tournament = [random.choice(population) for i in range(MAX_TOURNAMENT)]
    fitnesses = [fitness_function(tournament[i], COMPOSITION_STRATEGY, ENEMY_HEROES)
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
            individual[0] = top['id'][randint(0, len(top)-1)]
        elif i == 1:
            individual[1] = jungler['id'][randint(0, len(jungler)-1)]
        elif i == 2:
            individual[2] = mid['id'][randint(0, len(mid)-1)]
        else:
            individual[3] = carry['id'][randint(0, len(carry)-1)]
    return (individual)


def run_ga(strategy, NEEDED_RETURN_SIZE, ENEMY_HEROES=[], PICKED_HEROES={}, BANNED_HEROES=[]):

    global NEXT_PICKS
    global COMPOSITION_STRATEGY
    EXECUTION_WITHOUT_IMPROV_COUNTER = 0

    COMPOSITION_STRATEGY = strategy
    best_global_fit = 0

    population = create_population(POP_SIZE, PICKED_HEROES, BANNED_HEROES)

    # Starting GA
    for num_generation in range(MAX_GENERATIONS):

        if (MAX_EXECUTION_WITHOUT_IMPROV == EXECUTION_WITHOUT_IMPROV_COUNTER):
            return NEXT_PICKS

        best_individual = []
        fit_best_individual = 0

        current_best_fit = best_global_fit

        for individual in population:

            fit, orderCompositionDict = fitness_function(
                individual, COMPOSITION_STRATEGY, ENEMY_HEROES)
            if fit > fit_best_individual:
                fit_best_individual = fit
                best_individual = individual
            if fit > best_global_fit:
                best_global_fit = fit
                if PICKED_HEROES != [] and len(orderCompositionDict) != 0:
                    for lane, champion in PICKED_HEROES.items():
                        orderCompositionDict.pop(lane, None)

                    NEXT_PICKS = dict(itertools.islice(
                        orderCompositionDict.items(), NEEDED_RETURN_SIZE))

        print("The best: ", best_individual,
              " fitness value: ", fit_best_individual)

        if current_best_fit == best_global_fit:
            EXECUTION_WITHOUT_IMPROV_COUNTER = EXECUTION_WITHOUT_IMPROV_COUNTER + 1

        next_generation = []

        # start selection crossover and mutation
        for i in range(int(POP_SIZE/2)):
            # selection individuols more apts
            # prisoners_dilemma(population)
            pai1 = selection_method(population, ENEMY_HEROES)
            pai2 = selection_method(population, ENEMY_HEROES)
            # produce new individuols
            filhos = crossover(pai1, pai2)
            # perform mutation
            next_generation.append(mutation(filhos[0]))
            next_generation.append(mutation(filhos[1]))
            # TO-DO FEATURE: Incluir verificador que obrigue que PICKED_HEROES estejam presentes nos processos de cruzamento e mutação,
            # ao mesmo tempo que garanta que BANNED_HEROES não estejam nesses processos.

        population = next_generation
    return NEXT_PICKS
