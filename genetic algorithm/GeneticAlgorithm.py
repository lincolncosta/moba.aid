# this script was developed by Vinicius Tonello and Francisco Carlos Souza

import numpy as np
import os.path
import time
from FitnessFunction import fitness_function
from CreateIndividual import create_population
from Utils import *
import random
from random import randint
import pandas as pd
import sys

df = pd.read_csv('../assets/dataset/dataset.csv')

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

# ((max_exp (1) + max_dev (1)) / min_rework (0,3)) * GENOME_SIZE
MAX_TEAM_FITNESS = 37.4
POP_SIZE = 30  # population
GENOME_SIZE = 5  # number of genes
MAX_TOURNAMENT = 3  # selection method
MAX_GENERATIONS = 3  # number of generation
PROB_MUTATION = 0.3  # mutation
MEMORY_SIZE = 20  # check if fitness is increasing
LINES_PLOT = 4  # line plots

INDIVIDUAL_MEMORY = []  # to store the best individual of each generation
TER_MEMORIA = False  # false to use the max number of generation true to use memory
COMPOSITION_STRATEGY = sys.argv[1]

# selection method


def selection_method(population):
    tournament = [random.choice(population) for i in range(MAX_TOURNAMENT)]
    fitnesses = [fitness_function(tournament[i], COMPOSITION_STRATEGY)
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


# method to store individual
def store_individual(individual):
    if len(INDIVIDUAL_MEMORY) == MEMORY_SIZE:
        del INDIVIDUAL_MEMORY[0]
    INDIVIDUAL_MEMORY.append(individual)

# check if the fitness function is increasing


def check_evolution():
    return INDIVIDUAL_MEMORY.count(INDIVIDUAL_MEMORY[0]) == len(INDIVIDUAL_MEMORY) and len(INDIVIDUAL_MEMORY) == MEMORY_SIZE


historicos = []
times = []
best_global_individual = []
best_global_fit = 0

for w in range(LINES_PLOT):
    population = create_population(POP_SIZE)

    start_time = 0
    total_time = 0
    start_time = time.time()

    hist_geracoes = []  # plot axis x
    hist_fitness = []  # plot axis y

    # start ag
    for num_generation in range(MAX_GENERATIONS):

        best_individual = []
        fit_best_individual = 0

        for individual in population:

            fit = fitness_function(individual, COMPOSITION_STRATEGY)
            if fit > fit_best_individual:
                fit_best_individual = fit
                best_individual = individual
            if fit > best_global_fit:
                best_global_fit = fit
                best_global_individual = individual

        # print_population(population,POP_SIZE)

        print("The best: ", best_individual,
              " fitness value: ", fit_best_individual)

        hist_geracoes.append(num_generation)
        hist_fitness.append(fit_best_individual)

        # insert the best individual into the list
        store_individual(best_individual)
        # print(INDIVIDUAL_MEMORY)

        if TER_MEMORIA:
            if check_evolution():
                break

        next_generation = []

        # start selection crossover and mutation
        for i in range(int(POP_SIZE/2)):
            # selection individuols more apts
            # prisoners_dilemma(population)
            pai1 = selection_method(population)
            pai2 = selection_method(population)
            # produce new individuols
            filhos = crossover(pai1, pai2)
            # perform mutation
            next_generation.append(mutation(filhos[0]))
            next_generation.append(mutation(filhos[1]))

        population = next_generation

    total_time = (time.time() - start_time)
    times.append(total_time)
    print("--- %s seconds ---" % total_time)

    historicos.append([hist_fitness, hist_geracoes])

    print("-------------------------------------------------------------------------------------------")
    print("The best global individual: ", best_global_individual,
          " fitness value: ", best_global_fit)
    print("Formed Team Profile: |", df.iloc[best_global_individual[0], 6], "|", df.iloc[best_global_individual[1],
                                                                                        6], "|", df.iloc[best_global_individual[2], 6], "|", df.iloc[best_global_individual[3], 6])
    print("-------------------------------------------------------------------------------------------")


save_results(historicos)
save_time([times])
generate_team_picture(best_global_individual,
                      best_global_fit, COMPOSITION_STRATEGY)


# GERAR O GRAFICO COM TODOS OS RESULTADOS
fig, ax = plt.subplots()
for i, item in enumerate(historicos):
    ax.plot(item[1], item[0], '-',
            label='Fitness X Generation (' + str(i+1) + ')')
ax.legend()
plt.ylabel('Fitness')
plt.xlabel('Generation')
plt.grid(True)
plt.show()

# mean plot
if TER_MEMORIA == False:
    medias = []
    for i in range(MAX_GENERATIONS):
        valores = []
        for j, item in enumerate(historicos):
            valores.append(item[0][i])
        medias.append(np.mean(valores))
    # plot
    fig, ax = plt.subplots()
    ax.plot(range(MAX_GENERATIONS), medias, '-', label='Fitness X Generation')
    ax.legend()
    plt.ylabel('Fitness')
    plt.xlabel('Generation')
    plt.grid(True)
    plt.show()
