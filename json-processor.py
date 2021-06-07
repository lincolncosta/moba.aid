import json
import csv

with open('assets/dataset/json/dataset.json', 'r') as file:
    dataset = json.load(file)
champions_overview = dataset['lolChampionsListOverview']

with open('assets/dataset/json/champions.json', 'r') as file:
    champions_dataset = json.load(file)

with open('assets/dataset/dataset_11.10.csv', mode='a', newline="") as dataset1110:
    dataset1110.write('champion,winrate,role,counters\n')

for champion in champions_overview:
    name = champion['champion']['name']
    for champion_data in champions_dataset:
        if champion_data['name'].lower() == name.lower():
            champion_id = champion_data['id']

    role = champion['role']
    stats = champion['stats']
    win_rate = stats['winRate']

    matchups = champion['matchups']
    counters = []
    counters_dict = {}

    for matchup in matchups:
        counter_win_rate = matchup['winRate']
        if (counter_win_rate < 55):
            continue
        counter_name = matchup['champion']['name']
        for counter_champion_data in champions_dataset:
            if counter_champion_data['name'].lower() == counter_name.lower():
                counter_champion_id = counter_champion_data['id']
        counters_dict[counter_champion_id] = counter_win_rate
    ordered_counters = dict(
        sorted(counters_dict.items(), key=lambda item: item[1]))
    counters = list(ordered_counters.keys())
    with open('assets/dataset/dataset_11.10.csv', mode='a', newline="") as dataset1110:
        datasetWriter = csv.writer(dataset1110, delimiter=',')
        datasetWriter.writerow([champion_id, win_rate, role, counters])
