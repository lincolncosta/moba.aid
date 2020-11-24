import pandas as pd
import csv


df = pd.read_csv('../assets/dataset/dataset.csv')


def calcBonificador(winrate, roles, strategy):

    multiplier = 1

    if(strategy.lower() == 'teamfight'):
        goal_roles = ['Area of Effect', 'Hard Engage', 'Disengage']

    if(strategy.lower() == 'siege'):
        goal_roles = ['Poke', 'Disengage', 'Wave Clear']

    if(strategy.lower() == 'pickoff'):
        goal_roles = ['Hard Engage', 'Burst Damage']

    if(strategy.lower() == 'splitpush'):
        goal_roles = ['Burst Damage', 'Flank', 'Pusher', 'Wave Clear', 'Disengage']

    if(strategy.lower() == 'skirmish'):
        goal_roles = ['Debuff', 'Mobility', 'Burst Damage']

    for goal_role in goal_roles:
        if goal_role in roles:
            multiplier += 0.1

    return multiplier * winrate


for index, row in df.iterrows():

    # if(index == 0):
    lanes = row.lanes
    winrate = 0

    if ('Top' in lanes):
        winrate = row.top
        row.topteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.topsiege = "%.2f" % calcBonificador(
            winrate, row.roles, 'siege')
        row.toppickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.topsplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')
        row.topskirmish = "%.2f" % calcBonificador(
            winrate, row.roles, 'skirmish')

    if ('Jungler' in lanes):
        winrate = row.jungler
        row.junglerteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.junglersiege = "%.2f" % calcBonificador(
            winrate, row.roles, 'siege')
        row.junglerpickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.junglersplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')
        row.junglerskirmish = "%.2f" % calcBonificador(
            winrate, row.roles, 'skirmish')

    if ('Mid' in lanes):
        winrate = row.mid
        row.midteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.midsiege = "%.2f" % calcBonificador(
            winrate, row.roles, 'siege')
        row.midpickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.midsplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')
        row.midskirmish = "%.2f" % calcBonificador(
            winrate, row.roles, 'skirmish')

    if ('Carry' in lanes):
        winrate = row.carry
        row.carryteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.carrysiege = "%.2f" % calcBonificador(
            winrate, row.roles, 'siege')
        row.carrypickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.carrysplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')
        row.carryskirmish = "%.2f" % calcBonificador(
            winrate, row.roles, 'skirmish')

    if ('Support' in lanes):
        winrate = row.support
        row.supportteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.supportsiege = "%.2f" % calcBonificador(
            winrate, row.roles, 'siege')
        row.supportpickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.supportsplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')
        row.supportskirmish = "%.2f" % calcBonificador(
            winrate, row.roles, 'skirmish')

    csvfile = open('dataset-processado.csv', 'a')
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(row)
    csvfile.close()
