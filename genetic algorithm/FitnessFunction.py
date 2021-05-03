import pandas as pd
from collections import Counter


MAX_FIT_VALUE = 1
df = pd.read_csv('../assets/dataset/dataset.csv')


def fitness_function(champions, strategy, ENEMY_HEROES):

    MAX_FIT_VALUE, goal_roles = max_fit_roles_by_strategy(strategy)
    fit_value, orderCompositionDict = valid_composition_calculate_initial_fitness(
        champions, goal_roles, ENEMY_HEROES)
    fit_value = valid_damage_type_fitness(champions, fit_value)

    normalized_fit_value = fit_value / MAX_FIT_VALUE
    return normalized_fit_value, orderCompositionDict


def max_fit_roles_by_strategy(strategy):
    if(strategy.lower() == 'teamfight'):
        return 64.23, ['Area of Effect', 'Hard Engage', 'Disengage']

    if(strategy.lower() == 'siege'):
        return 64.24, ['Poke', 'Disengage', 'Wave Clear']

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


def orderCompositionWinrate(winrateTop, winrateJungle, winrateMid, winrateCarry, winrateSupp, idTop, idJungle, idMid, idCarry, idSupp):
    composition = {
        'top': winrateTop,
        'jungle': winrateJungle,
        'mid': winrateMid,
        'carry': winrateCarry,
        'supp': winrateSupp
    }

    sortedCompositionDict = dict(
        sorted(composition.items(), key=lambda item: item[1], reverse=True))

    sortedCompositionDict['top'] = idTop
    sortedCompositionDict['jungle'] = idJungle
    sortedCompositionDict['mid'] = idMid
    sortedCompositionDict['carry'] = idCarry
    sortedCompositionDict['supp'] = idSupp

    return sortedCompositionDict


def valid_composition_calculate_initial_fitness(champions, goal_roles, ENEMY_HEROES):
    fitness = 0
    hasCarry = False
    hasSupp = False
    hasMid = False
    hasTop = False
    hasJungle = False
    orderCompositionDict = {}

    for champion in champions:
        lanes = df.loc[df.id == champion].lanes.to_string()
        counters = df.loc[df.id == champion].counters.to_string()
        championCountersMultiplier = calculate_multiplier_by_enemy_heroes(
            counters, ENEMY_HEROES)

        if ('Top' in lanes and not hasTop):
            hasTop = True
            idTop = champion
            winrateTop = pd.to_numeric(
                df.loc[df.id == champion]['top']).values[0]
            winrateTop = valid_roles_calculate_multiplier(
                winrateTop * championCountersMultiplier, champion, goal_roles)
            continue

        if ('Jungler' in lanes and not hasJungle):
            hasJungle = True
            idJungle = champion
            winrateJungle = pd.to_numeric(
                df.loc[df.id == champion]['jungler']).values[0]
            winrateJungle = valid_roles_calculate_multiplier(
                winrateJungle * championCountersMultiplier, champion, goal_roles)
            continue

        if ('Mid' in lanes and not hasMid):
            hasMid = True
            idMid = champion
            winrateMid = pd.to_numeric(
                df.loc[df.id == champion]['mid']).values[0]
            winrateMid = valid_roles_calculate_multiplier(
                winrateMid * championCountersMultiplier, champion, goal_roles)
            continue

        if ('Carry' in lanes and not hasCarry):
            hasCarry = True
            idCarry = champion
            winrateCarry = pd.to_numeric(
                df.loc[df.id == champion]['carry']).values[0]
            winrateCarry = valid_roles_calculate_multiplier(
                winrateCarry * championCountersMultiplier, champion, goal_roles)
            continue

        if ('Support' in lanes and not hasSupp):
            hasSupp = True
            idSupp = champion
            winrateSupp = pd.to_numeric(
                df.loc[df.id == champion]['support']).values[0]
            winrateSupp = valid_roles_calculate_multiplier(
                winrateSupp * championCountersMultiplier, champion, goal_roles)
            continue

    if (hasCarry and hasSupp and hasMid and hasTop and hasJungle):
        orderCompositionDict = orderCompositionWinrate(
            winrateTop, winrateJungle, winrateMid, winrateCarry, winrateSupp, idTop, idJungle, idMid, idCarry, idSupp)
        fitness = (winrateCarry + winrateSupp + winrateMid +
                   winrateTop + winrateJungle) / 5

    return fitness, orderCompositionDict


def valid_roles_calculate_multiplier(winrate, champion, goal_roles):

    multiplier = 1

    for goal_role in goal_roles:
        if goal_role in df.loc[df.id == champion].roles.to_string():
            multiplier += 0.1
            continue

    return winrate * multiplier


def calculate_multiplier_by_enemy_heroes(counters, ENEMY_HEROES):
    multiplier = 1
    for enemy_hero in ENEMY_HEROES:
        if str(enemy_hero) in counters:
            multiplier += 0.1
    return multiplier
