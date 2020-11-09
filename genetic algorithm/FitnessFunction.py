import pandas as pd
from collections import Counter
from collections import Counter


# ((max_exp (1) + max_dev (1)) / min_rework (0,3)) * GENOME_SIZE
MAX_TEAM_FITNESS = 37.4

df = pd.read_csv('data/bd_norm.csv')


def fitness_function(solution):
    fit_value = 0
    personalities = []
    for i in solution:
        personalities.append(df.iloc[i, 6])
        exp = df.iloc[i, 3]
        productivity = df.iloc[i, 4]
        rework = df.iloc[i, 5]
        value = (exp + productivity) / rework
        fit_value += value
    fit_value = check_heterogeneity(personalities, fit_value)
    fit_value = round(fit_value, 2) / MAX_TEAM_FITNESS
    return fit_value


def check_heterogeneity(individual, fitness):
    length = len(Counter(individual).values())

    if length == 4:
        fitness = fitness + (fitness * 0.1)
    else:
        fitness = fitness - (fitness * 0.1)

    return fitness
