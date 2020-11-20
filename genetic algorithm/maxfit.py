import pandas as pd
import csv


df = pd.read_csv('../assets/dataset/dataset.csv')


def calcBonificador(winrate, roles, strategy):

    multiplier = 1    

    if(strategy.lower() == 'teamfight'):
        goal_roles = ['Area of Effect']

    if(strategy.lower() == 'hardengage'):
        goal_roles = ['Hard Engage', 'Debuff']

    if(strategy.lower() == 'poke'):
        goal_roles = ['Poke', 'Disengage']

    if(strategy.lower() == 'pickoff'):
        goal_roles = ['Burst Damage', 'Flank']

    if(strategy.lower() == 'splitpush'):
        goal_roles = ['Waveclear', 'Disengage', 'Pusher']

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
        row.tophardengage = "%.2f" % calcBonificador(
            winrate, row.roles, 'hardengage')
        row.toppoke = "%.2f" % calcBonificador(
            winrate, row.roles, 'poke')
        row.toppickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.topsplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')

    if ('Jungler' in lanes):
        winrate = row.jungler
        row.junglerteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.junglerhardengage = "%.2f" % calcBonificador(
            winrate, row.roles, 'hardengage')
        row.junglerpoke = "%.2f" % calcBonificador(
            winrate, row.roles, 'poke')
        row.junglerpickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.junglersplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')

    if ('Mid' in lanes):
        winrate = row.mid
        row.midteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.midhardengage = "%.2f" % calcBonificador(
            winrate, row.roles, 'hardengage')
        row.midpoke = "%.2f" % calcBonificador(
            winrate, row.roles, 'poke')
        row.midpickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.midsplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')

    if ('Carry' in lanes):
        winrate = row.carry
        row.carryteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.carryhardengage = "%.2f" % calcBonificador(
            winrate, row.roles, 'hardengage')
        row.carrypoke = "%.2f" % calcBonificador(
            winrate, row.roles, 'poke')
        row.carrypickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.carrysplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')

    if ('Support' in lanes):
        winrate = row.support
        row.supportteamfight = "%.2f" % calcBonificador(
            winrate, row.roles, 'teamfight')
        row.supporthardengage = "%.2f" % calcBonificador(
            winrate, row.roles, 'hardengage')
        row.supportpoke = "%.2f" % calcBonificador(
            winrate, row.roles, 'poke')
        row.supportpickoff = "%.2f" % calcBonificador(
            winrate, row.roles, 'pickoff')
        row.supportsplitpush = "%.2f" % calcBonificador(
            winrate, row.roles, 'splitpush')

    csvfile = open('dataset-processado.csv', 'a')
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(row)
    csvfile.close()
