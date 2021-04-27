import random
from random import randint
import numpy as np
import pandas as pd

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

# method to create the solutions without repetitions


def check_duplicated(chromosome):
    chromosome_set = set(chromosome)
    return len(chromosome) != len(chromosome_set)


def create_individual(PICKED_HEROES={}):
    has_duplicated = True

    while(has_duplicated):
        chromosome = [PICKED_HEROES['top'] if 'top' in PICKED_HEROES else top['id'][randint(0, len(top)-1)],
                      jungler['id'][randint(0, len(jungler)-1)],
                      mid['id'][randint(0, len(mid)-1)],
                      carry['id'][randint(0, len(carry)-1)],
                      support['id'][randint(0, len(support)-1)]]
        has_duplicated = check_duplicated(chromosome)
    return chromosome

# method to create the population


def create_population(POP_SIZE, PICKED_HEROES={}):
    population = []
    for x in range(POP_SIZE):
        individual = create_individual()
        while individual in population:
            individual = create_individual()
        population.append(individual)
    return population
