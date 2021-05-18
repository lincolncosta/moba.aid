import pandas as pd
from Dataset import Dataset

MAX_FIT_VALUE = 1


def fitness_function(champions, strategy, ENEMY_HEROES):
    MAX_FIT_VALUE, goal_roles = max_fit_roles_by_strategy(strategy)
    fit_value = valid_composition_calculate_initial_fitness(
        champions, goal_roles, ENEMY_HEROES)
    fit_value = valid_damage_type_fitness(champions, fit_value)

    normalized_fit_value = fit_value / MAX_FIT_VALUE
    return normalized_fit_value


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
        damage = Dataset.df.loc[Dataset.df.id == champion].damage.to_string()
        amountAP = 0
        amountAD = 0

        if(damage == 'AP'):
            amountAP += 1
        elif(damage == 'AD'):
            amountAD += 1
        elif(damage == 'Hybrid'):
            amountAP += 1
            amountAD += 1

    if (amountAD < 2 or amountAP < 2):
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


def calculate_winrate_by_champion(idChampion, lane, goal_roles, ENEMY_HEROES):
    counters = Dataset.df.loc[Dataset.df.id ==
                              idChampion].counters.to_string()
    countersMultiplier = calculate_multiplier_by_enemy_heroes(
        counters, ENEMY_HEROES)
    winrate = pd.to_numeric(
        Dataset.df.loc[Dataset.df.id == idChampion][lane]).values[0]
    winrate = valid_roles_calculate_multiplier(
        winrate * countersMultiplier, idChampion, goal_roles)

    return winrate


def order_next_picks(idTop, idJungle, idMid, idCarry, idSupp, strategy, ENEMY_HEROES):

    MAX_FIT_VALUE, goal_roles = max_fit_roles_by_strategy(strategy)

    winrateTop = calculate_winrate_by_champion(
        idTop, 'top', goal_roles, ENEMY_HEROES)
    winrateJungle = calculate_winrate_by_champion(
        idJungle, 'jungler', goal_roles, ENEMY_HEROES)
    winrateMid = calculate_winrate_by_champion(
        idMid, 'mid', goal_roles, ENEMY_HEROES)
    winrateCarry = calculate_winrate_by_champion(
        idCarry, 'carry', goal_roles, ENEMY_HEROES)
    winrateSupp = calculate_winrate_by_champion(
        idSupp, 'support', goal_roles, ENEMY_HEROES)

    return orderCompositionWinrate(winrateTop, winrateJungle, winrateMid,
                                   winrateCarry, winrateSupp, idTop, idJungle, idMid, idCarry, idSupp)


def valid_composition_calculate_initial_fitness(champions, goal_roles, ENEMY_HEROES):
    fitness = 0
    hasCarry = False
    hasSupp = False
    hasMid = False
    hasTop = False
    hasJungle = False

    for champion in champions:
        lanes = Dataset.df.loc[Dataset.df.id == champion].lanes.to_string()
        counters = Dataset.df.loc[Dataset.df.id ==
                                  champion].counters.to_string()
        championCountersMultiplier = calculate_multiplier_by_enemy_heroes(
            counters, ENEMY_HEROES)

        if (not hasTop and 'Top' in lanes):
            hasTop = True
            winrateTop = pd.to_numeric(
                Dataset.df.loc[Dataset.df.id == champion]['top']).values[0]
            winrateTop = valid_roles_calculate_multiplier(
                winrateTop * championCountersMultiplier, champion, goal_roles)
            continue

        if (not hasJungle and 'Jungler' in lanes):
            hasJungle = True
            winrateJungle = pd.to_numeric(
                Dataset.df.loc[Dataset.df.id == champion]['jungler']).values[0]
            winrateJungle = valid_roles_calculate_multiplier(
                winrateJungle * championCountersMultiplier, champion, goal_roles)
            continue

        if (not hasMid and 'Mid' in lanes):
            hasMid = True
            winrateMid = pd.to_numeric(
                Dataset.df.loc[Dataset.df.id == champion]['mid']).values[0]
            winrateMid = valid_roles_calculate_multiplier(
                winrateMid * championCountersMultiplier, champion, goal_roles)
            continue

        if (not hasCarry and 'Carry' in lanes):
            hasCarry = True
            winrateCarry = pd.to_numeric(
                Dataset.df.loc[Dataset.df.id == champion]['carry']).values[0]
            winrateCarry = valid_roles_calculate_multiplier(
                winrateCarry * championCountersMultiplier, champion, goal_roles)
            continue

        if (not hasSupp and 'Support' in lanes):
            hasSupp = True
            winrateSupp = pd.to_numeric(
                Dataset.df.loc[Dataset.df.id == champion]['support']).values[0]
            winrateSupp = valid_roles_calculate_multiplier(
                winrateSupp * championCountersMultiplier, champion, goal_roles)
            continue

    if (hasCarry and hasSupp and hasMid and hasTop and hasJungle):
        fitness = (winrateCarry + winrateSupp + winrateMid +
                   winrateTop + winrateJungle) / 5

    return fitness


def valid_roles_calculate_multiplier(winrate, champion, goal_roles):

    multiplier = 1

    for goal_role in goal_roles:
        if goal_role in Dataset.df.loc[Dataset.df.id == champion].roles.to_string():
            multiplier += 0.1
            continue

    return winrate * multiplier


def calculate_multiplier_by_enemy_heroes(counters, ENEMY_HEROES):
    multiplier = 1
    for enemy_hero in ENEMY_HEROES:
        if str(enemy_hero) in counters:
            multiplier += 0.1
    return multiplier
