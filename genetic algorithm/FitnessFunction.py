import pandas as pd
from collections import Counter


MAX_FIT_VALUE = 1
df = pd.read_csv('../assets/dataset/dataset.csv')


def fitness_function(champions, strategy):

    MAX_FIT_VALUE, goal_roles = max_fit_roles_by_strategy(strategy)
    fit_value = valid_composition_calculate_initial_fitness(champions)
    fit_value = valid_damage_type_fitness(champions, fit_value)
    multiplier = valid_roles_calculate_multiplier(champions, goal_roles)

    fit_value = (fit_value * multiplier) / MAX_FIT_VALUE

    return fit_value


def max_fit_roles_by_strategy(strategy):
    if(strategy.lower() == 'teamfight'):
        return 64.23, ['Area of Effect', 'Hard Engage', 'Disengage']

    if(strategy.lower() == 'siege'):
        return 62.24, ['Poke', 'Disengage', 'Wave Clear']

    if(strategy.lower() == 'pickoff'):
        return 62.02, ['Hard Engage', 'Burst Damage']

    if(strategy.lower() == 'splitpush'):
        return 67.47, ['Burst Damage', 'Flank', 'Pusher', 'Wave Clear', 'Disengage']

    if(strategy.lower() == 'skirmish'):
        return 64.65, ['Debuff', 'Mobility', 'Burst Damage']


def valid_damage_type_fitness(champions, fit_value):
    for champion in champions:
        damage = df.loc[df.id == champion].damage.to_string()
        counterAP = 0
        counterAD = 0

        if(damage == 'AP'):
            counterAP += 1
        elif(damage == 'AD'):
            counterAD += 1
        elif(damage == 'Hybrid'):
            counterAP += 1
            counterAD += 1

    if (counterAD < 2 or counterAP < 2):
        fit_value = fit_value - ((fit_value / 100) * 10)

    return fit_value


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
