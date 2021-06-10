from random import choice
from Dataset import Dataset


def check_duplicated(chromosome):
    chromosome_set = set(chromosome)
    return len(chromosome) != len(chromosome_set)


def create_individual(PICKED_HEROES, BANNED_HEROES):
    has_duplicated = True

    while(has_duplicated):
        chromosome = [PICKED_HEROES['top'] if 'top' in PICKED_HEROES else Dataset.top['id'][choice([i for i in range(0, len(Dataset.top)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['jungler'] if 'jungler' in PICKED_HEROES else Dataset.jungler['id'][choice(
                          [i for i in range(0, len(Dataset.jungler)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['mid'] if 'mid' in PICKED_HEROES else Dataset.mid['id'][choice(
                          [i for i in range(0, len(Dataset.mid)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['adc'] if 'adc' in PICKED_HEROES else Dataset.adc['id'][choice(
                          [i for i in range(0, len(Dataset.adc)) if i not in BANNED_HEROES])],
                      PICKED_HEROES['support'] if 'support' in PICKED_HEROES else Dataset.support['id'][choice([i for i in range(0, len(Dataset.support)) if i not in BANNED_HEROES])]]
        has_duplicated = check_duplicated(chromosome)
    return chromosome


def create_population(POP_SIZE, PICKED_HEROES, BANNED_HEROES):
    population = []
    for _ in range(POP_SIZE):
        individual = create_individual(PICKED_HEROES, BANNED_HEROES)
        while individual in population:
            individual = create_individual(PICKED_HEROES, BANNED_HEROES)
        population.append(individual)
    return population
