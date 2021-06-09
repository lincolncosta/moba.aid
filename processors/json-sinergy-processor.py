import json
import csv

files = ['adc_supp', 'jungle_adc', 'jungle_mid', 'jungle_supp',
         'mid_adc', 'mid_supp', 'top_adc', 'top_jungle', 'top_mid', 'top_supp']

for file_name in files:
    with open('assets/dataset/json/dataset_{}.json'.format(file_name), 'r') as file:
        dataset = json.load(file)
    champions = dataset['data']

    with open('assets/dataset/dataset_sinergies_11.10.csv', mode='a', newline="") as dataset1110:
        dataset1110.write('champion1, champion2, role1, role2, win_rate\n')

    for champion in champions:
        champion1 = champion['champion']['champion_id']
        role1 = champion['champion']['role']

        champion2 = champion['duo_champion']['champion_id']
        role2 = champion['duo_champion']['role']

        win_rate = champion['duo_win_rate']
        with open('assets/dataset/dataset_sinergies_11.10.csv', mode='a', newline="") as dataset1110:
            datasetWriter = csv.writer(dataset1110, delimiter=',')
            datasetWriter.writerow(
                [champion1, champion2, role1, role2, win_rate])
