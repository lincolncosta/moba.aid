import pandas as pd
from Dataset import Dataset

MAX_FIT_VALUE = 1


def fitness_function(champions, ENEMY_HEROES):
    fit_value = valid_composition_calculate_initial_fitness(
        champions, ENEMY_HEROES)

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


def calculate_winrate_by_champion(idChampion, lane):
    winrate = Dataset.df[(Dataset.df['id'] == idChampion) & (
        Dataset.df['lanes'] == lane)].winrate.values[0]

    return winrate


def order_next_picks(idTop, idJungle, idMid, idCarry, idSupp, ENEMY_HEROES):

    winrateTop = calculate_winrate_by_champion(
        idTop, 'top')
    winrateJungle = calculate_winrate_by_champion(
        idJungle, 'jungle')
    winrateMid = calculate_winrate_by_champion(
        idMid, 'mid')
    winrateCarry = calculate_winrate_by_champion(
        idCarry, 'adc')
    winrateSupp = calculate_winrate_by_champion(
        idSupp, 'support')

    return orderCompositionWinrate(winrateTop, winrateJungle, winrateMid,
                                   winrateCarry, winrateSupp, idTop, idJungle, idMid, idCarry, idSupp)


def valid_composition_calculate_initial_fitness(champions, ENEMY_HEROES):
    fitness = 0
    hasCarry = False
    hasSupp = False
    hasMid = False
    hasTop = False
    hasJungle = False

    for champion in champions:
        lanes = Dataset.df.loc[Dataset.df.id == champion].lanes.to_string()

        if (not hasTop and 'top' in lanes.lower()):
            hasTop = True
            topInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'top')]
            winrateTop = topInfos.winrate.values[0]
            winrateTop = calculate_multiplier_by_enemy_heroes(winrateTop, topInfos.counters, ENEMY_HEROES)
            winrateTop = calculate_multiplier_by_tier(winrateTop, topInfos.tier.values[0])
            continue

        if (not hasJungle and 'jungle' in lanes.lower()):
            hasJungle = True
            jungleInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'jungle')]
            winrateJungle = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'jungle')].winrate.values[0]
            winrateJungle = calculate_multiplier_by_enemy_heroes(winrateJungle, jungleInfos.counters, ENEMY_HEROES)
            winrateJungle = calculate_multiplier_by_tier(winrateJungle, topInfos.tier.values[0])
            continue

        if (not hasMid and 'mid' in lanes.lower()):
            hasMid = True
            midInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'jungle')]
            winrateMid = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'mid')].winrate.values[0]
            winrateMid = calculate_multiplier_by_enemy_heroes(winrateMid, midInfos.counters, ENEMY_HEROES)
            winrateMid = calculate_multiplier_by_tier(winrateMid, topInfos.tier.values[0])
            continue

        if (not hasCarry and 'adc' in lanes.lower()):
            hasCarry = True
            carryInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'jungle')]
            winrateCarry = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'adc')].winrate.values[0]
            winrateCarry = calculate_multiplier_by_enemy_heroes(winrateCarry, carryInfos.counters, ENEMY_HEROES)
            winrateCarry = calculate_multiplier_by_tier(winrateCarry, topInfos.tier.values[0])
            continue

        if (not hasSupp and 'support' in lanes.lower()):
            hasSupp = True
            suppInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'jungle')]
            winrateSupp = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'support')].winrate.values[0]
            winrateSupp = calculate_multiplier_by_enemy_heroes(winrateSupp, suppInfos.counters, ENEMY_HEROES)
            winrateSupp = calculate_multiplier_by_tier(winrateSupp, topInfos.tier.values[0])
            continue

    if (hasCarry and hasSupp and hasMid and hasTop and hasJungle):
        fitness = (winrateCarry + winrateSupp + winrateMid +
                   winrateTop + winrateJungle) / 5

    return fitness


def calculate_multiplier_by_tier(winrate, tier):

    multiplier = 1

    if tier == 0:
        return winrate * multiplier
    elif tier == 5:
        multiplier += 0.05
    elif tier == 4:
        multiplier += 0.1
    elif tier == 3:
        multiplier += 0.15
    elif tier == 2:
        multiplier += 0.2
    elif tier == 1:
        multiplier += 0.25    

    return winrate * multiplier


def calculate_multiplier_by_enemy_heroes(winrate, counters, ENEMY_HEROES):
    multiplier = 1
    for enemy_hero in ENEMY_HEROES:
        if str(enemy_hero) in counters:
            multiplier += 0.1
    return winrate * multiplier
