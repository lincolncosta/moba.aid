from Dataset import Dataset

MAX_FIT_VALUE = 1


def fitness_function(champions, ENEMY_HEROES):
    fit_value = valid_composition_calculate_initial_fitness(
        champions, ENEMY_HEROES)
    fit_value = calculate_fit_value_by_sinergy(champions, fit_value)

    normalized_fit_value = fit_value / MAX_FIT_VALUE
    return normalized_fit_value


def orderCompositionWinrate(winrateTop, winrateJungle, winrateMid, winrateCarry, winrateSupp, idTop, idJungle, idMid, idCarry, idSupp):
    composition = {
        'top': winrateTop,
        'jungle': winrateJungle,
        'mid': winrateMid,
        'adc': winrateCarry,
        'support': winrateSupp
    }

    sortedCompositionDict = dict(
        sorted(composition.items(), key=lambda item: item[1], reverse=True))

    sortedCompositionDict['top'] = idTop
    sortedCompositionDict['jungle'] = idJungle
    sortedCompositionDict['mid'] = idMid
    sortedCompositionDict['adc'] = idCarry
    sortedCompositionDict['support'] = idSupp

    return sortedCompositionDict


def calculate_winrate_by_champion(idChampion, lane):
    winrate = Dataset.df[(Dataset.df['id'] == idChampion) & (
        Dataset.df['lanes'] == lane)].winrate.values[0]

    return winrate


def order_next_picks(idTop, idJungle, idMid, idCarry, idSupp):

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
            winrateTop = calculate_multiplier_by_enemy_heroes(
                winrateTop, topInfos.counters, ENEMY_HEROES)
            winrateTop = calculate_multiplier_by_tier(
                winrateTop, topInfos.tier.values[0])
            continue

        if (not hasJungle and 'jungle' in lanes.lower()):
            hasJungle = True
            jungleInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'jungle')]
            winrateJungle = jungleInfos.winrate.values[0]
            winrateJungle = calculate_multiplier_by_enemy_heroes(
                winrateJungle, jungleInfos.counters, ENEMY_HEROES)
            winrateJungle = calculate_multiplier_by_tier(
                winrateJungle, jungleInfos.tier.values[0])
            continue

        if (not hasMid and 'mid' in lanes.lower()):
            hasMid = True
            midInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'mid')]
            winrateMid = midInfos.winrate.values[0]
            winrateMid = calculate_multiplier_by_enemy_heroes(
                winrateMid, midInfos.counters, ENEMY_HEROES)
            winrateMid = calculate_multiplier_by_tier(
                winrateMid, midInfos.tier.values[0])
            continue

        if (not hasCarry and 'adc' in lanes.lower()):
            hasCarry = True
            carryInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'adc')]
            winrateCarry = carryInfos.winrate.values[0]
            winrateCarry = calculate_multiplier_by_enemy_heroes(
                winrateCarry, carryInfos.counters, ENEMY_HEROES)
            winrateCarry = calculate_multiplier_by_tier(
                winrateCarry, carryInfos.tier.values[0])
            continue

        if (not hasSupp and 'support' in lanes.lower()):
            hasSupp = True
            suppInfos = Dataset.df[(Dataset.df['id'] == champion) & (
                Dataset.df['lanes'] == 'support')]
            winrateSupp = suppInfos.winrate.values[0]
            winrateSupp = calculate_multiplier_by_enemy_heroes(
                winrateSupp, suppInfos.counters, ENEMY_HEROES)
            winrateSupp = calculate_multiplier_by_tier(
                winrateSupp, suppInfos.tier.values[0])
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


def calculate_fit_value_by_sinergy(champions, fit_value):
    top = champions[0]
    jungle = champions[1]
    mid = champions[2]
    adc = champions[3]
    support = champions[4]
    negative_multiplier = 1
    sinergy_value = 0
    sinergy_counter = 1

    adc_supp = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == adc) & (Dataset.df_sinergy['champion2'] == support) & (
        Dataset.df_sinergy['role1'] == 'adc') & (Dataset.df_sinergy['role2'] == 'support')].winrate
    if(len(adc_supp) > 0):
        adc_supp = adc_supp.values[0] * 100
        sinergy_value = sinergy_value + adc_supp
        sinergy_counter += 1
    else:
        adc_supp = 1
        negative_multiplier = negative_multiplier - 0.05

    jungle_adc = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == jungle) & (Dataset.df_sinergy['champion2'] == adc) & (
        Dataset.df_sinergy['role1'] == 'jungle') & (Dataset.df_sinergy['role2'] == 'adc')].winrate
    if(len(jungle_adc) > 0):
        jungle_adc = jungle_adc.values[0] * 100
        sinergy_value = sinergy_value + jungle_adc
        sinergy_counter += 1
    else:
        jungle_adc = 1
        negative_multiplier = negative_multiplier - 0.05

    jungle_mid = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == jungle) & (Dataset.df_sinergy['champion2'] == mid) & (
        Dataset.df_sinergy['role1'] == 'jungle') & (Dataset.df_sinergy['role2'] == 'mid')].winrate
    if(len(jungle_mid) > 0):
        jungle_mid = jungle_mid.values[0] * 100
        sinergy_value = sinergy_value + jungle_mid
        sinergy_counter += 1
    else:
        jungle_mid = 1
        negative_multiplier = negative_multiplier - 0.05

    jungle_supp = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == jungle) & (Dataset.df_sinergy['champion2'] == support) & (
        Dataset.df_sinergy['role1'] == 'jungle') & (Dataset.df_sinergy['role2'] == 'support')].winrate
    if(len(jungle_supp) > 0):
        jungle_supp = jungle_supp.values[0] * 100
        sinergy_value = sinergy_value + jungle_supp
        sinergy_counter += 1
    else:
        jungle_supp = 1
        negative_multiplier = negative_multiplier - 0.05

    mid_adc = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == mid) & (Dataset.df_sinergy['champion2'] == adc) & (
        Dataset.df_sinergy['role1'] == 'mid') & (Dataset.df_sinergy['role2'] == 'adc')].winrate
    if(len(mid_adc) > 0):
        mid_adc = mid_adc.values[0] * 100
        sinergy_value = sinergy_value + mid_adc
        sinergy_counter += 1
    else:
        mid_adc = 1
        negative_multiplier = negative_multiplier - 0.05

    mid_supp = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == mid) & (Dataset.df_sinergy['champion2'] == support) & (
        Dataset.df_sinergy['role1'] == 'mid') & (Dataset.df_sinergy['role2'] == 'support')].winrate
    if(len(mid_supp) > 0):
        mid_supp = mid_supp.values[0] * 100
        sinergy_value = sinergy_value + mid_supp
        sinergy_counter += 1
    else:
        mid_supp = 1
        negative_multiplier = negative_multiplier - 0.05

    top_adc = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == top) & (Dataset.df_sinergy['champion2'] == adc) & (
        Dataset.df_sinergy['role1'] == 'top') & (Dataset.df_sinergy['role2'] == 'adc')].winrate
    if(len(top_adc) > 0):
        top_adc = top_adc.values[0] * 100
        sinergy_value = sinergy_value + top_adc
        sinergy_counter += 1
    else:
        top_adc = 1
        negative_multiplier = negative_multiplier - 0.05

    top_jungle = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == top) & (Dataset.df_sinergy['champion2'] == jungle) & (
        Dataset.df_sinergy['role1'] == 'top') & (Dataset.df_sinergy['role2'] == 'jungle')].winrate
    if(len(top_jungle) > 0):
        top_jungle = top_jungle.values[0]
        sinergy_value = sinergy_value + top_jungle
        sinergy_counter += 1
    else:
        top_jungle = 1
        negative_multiplier = negative_multiplier - 0.05

    top_mid = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == top) & (Dataset.df_sinergy['champion2'] == mid) & (
        Dataset.df_sinergy['role1'] == 'top') & (Dataset.df_sinergy['role2'] == 'mid')].winrate
    if(len(top_mid) > 0):
        top_mid = top_mid.values[0] * 100
        sinergy_value = sinergy_value + top_mid
        sinergy_counter += 1
    else:
        top_mid = 1
        negative_multiplier = negative_multiplier - 0.05

    top_supp = Dataset.df_sinergy[(Dataset.df_sinergy['champion1'] == top) & (Dataset.df_sinergy['champion2'] == support) & (
        Dataset.df_sinergy['role1'] == 'top') & (Dataset.df_sinergy['role2'] == 'support')].winrate
    if(len(top_supp) > 0):
        top_supp = top_supp.values[0] * 100
        sinergy_value = sinergy_value + top_supp
        sinergy_counter += 1
    else:
        top_supp = 1
        negative_multiplier = negative_multiplier - 0.05

    negative_multiplier = float(round(negative_multiplier, 2))
    sinergy_value = float(round(sinergy_value, 2))

    sinergy_avg = sinergy_value / sinergy_counter
    sinergy_penalized = sinergy_avg * negative_multiplier

    fit_value = (fit_value + sinergy_penalized) / 2
    return fit_value
