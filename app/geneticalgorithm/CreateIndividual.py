from random import choice
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


def check_duplicated(chromosome):
    chromosome_set = set(chromosome)
    return len(chromosome) != len(chromosome_set)


def create_individual(PICKED_HEROES, BANNED_HEROES):
    has_duplicated = True

    while(has_duplicated):        
        chromosome = [PICKED_HEROES['top'] if 'top' in PICKED_HEROES else top['id'][choice([i for i in range(0,len(top)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['jungler'] if 'jungler' in PICKED_HEROES else jungler['id'][choice([i for i in range(0,len(jungler)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['mid'] if 'mid' in PICKED_HEROES else mid['id'][choice([i for i in range(0,len(mid)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['carry'] if 'carry' in PICKED_HEROES else carry['id'][choice([i for i in range(0,len(carry)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['support'] if 'support' in PICKED_HEROES else support['id'][choice([i for i in range(0,len(support)) if i not in BANNED_HEROES])]]
        has_duplicated = check_duplicated(chromosome)
    return chromosome


def create_population(POP_SIZE, PICKED_HEROES, BANNED_HEROES):
    population = []
    PICKED_HEROES = {'top': 5}
    for x in range(POP_SIZE):
        individual = create_individual(PICKED_HEROES, BANNED_HEROES)
        while individual in population:
            individual = create_individual(PICKED_HEROES, BANNED_HEROES)
        population.append(individual)
    return population
