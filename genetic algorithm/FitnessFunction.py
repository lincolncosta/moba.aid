import pandas as pd
from collections import Counter


MAX_FIT_VALUE = 1
df = pd.read_csv('../assets/dataset/dataset.csv')


def fitness_function(champions, strategy):
    MAX_FIT_VALUE, goal_roles = max_fit_roles_by_strategy(strategy)
    fit_value = valid_composition_calculate_initial_fitness(champions)
    multiplier = valid_roles_calculate_multiplier(champions, goal_roles)

    fit_value = (fit_value * multiplier) / MAX_FIT_VALUE

    return fit_value


def max_fit_roles_by_strategy(strategy):
    if(strategy.lower() == 'teamfight'):
        return 1, ['Area of Effect']

    if(strategy.lower() == 'hardengage'):
        return 1, ['Hard Engage', 'Crowd Control']

    if(strategy.lower() == 'poke'):
        return 1, ['Poke', 'Disengage']

    if(strategy.lower() == 'pickoff'):
        return 1, ['Burst Damage', 'Hard Engage']

    if(strategy.lower() == 'splitpush'):
        return 1, ['Waveclear', 'Burst Damage', 'Pusher']

def valid_composition_calculate_initial_fitness(champions):
    fitness = 0
    hasCarry = False
    hasSupp = False
    hasMid = False
    hasTop = False
    hasJungle = False

    for champion in champions:
        lanes = df.loc[df.id == champion].lanes.to_string()

        if ('Top' in lanes and not hasTop):
            hasTop = True
            winrateTop = pd.to_numeric(
                df.loc[df.id == champion]['top']).values[0]
            continue

        if ('Jungler' in lanes and not hasJungle):
            hasJungle = True
            winrateJungle = pd.to_numeric(
                df.loc[df.id == champion]['jungler']).values[0]
            continue

        if ('Mid' in lanes and not hasMid):
            hasMid = True
            winrateMid = pd.to_numeric(
                df.loc[df.id == champion]['mid']).values[0]
            continue

        if ('Carry' in lanes and not hasCarry):
            hasCarry = True
            winrateCarry = pd.to_numeric(
                df.loc[df.id == champion]['carry']).values[0]
            continue

        if ('Support' in lanes and not hasSupp):
            hasSupp = True
            winrateSupp = pd.to_numeric(
                df.loc[df.id == champion]['support']).values[0]
            continue

    if (hasCarry and hasSupp and hasMid and hasTop and hasJungle):
        fitness = (winrateCarry + winrateSupp + winrateMid +
                   winrateTop + winrateJungle) / 5

    return fitness


def valid_roles_calculate_multiplier(champions, goal_roles):

    multiplier = 1

    for champion in champions:
        for goal_role in goal_roles:
            if goal_role in df.loc[df.id == champion]['roles']:
                multiplier += 0.1
                continue

    return multiplier
