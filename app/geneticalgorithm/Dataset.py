import pandas as pd

class Dataset:
    df = pd.read_csv('assets/dataset/dataset_11.10.csv')
    df_sinergy = pd.read_csv('assets/dataset/dataset_sinergies_11.10.csv')

    top = df.loc[df.lanes.str.lower() == 'top']
    jungler = df.loc[df.lanes.str.lower() == 'jungle']
    mid = df.loc[df.lanes.str.lower() == 'mid']
    carry = df.loc[df.lanes.str.lower() == 'adc']
    support = df.loc[df.lanes.str.lower() == 'support']

    top.index = range(len(top.index))
    jungler.index = range(len(jungler.index))
    mid.index = range(len(mid.index))
    carry.index = range(len(carry.index))
    support.index = range(len(support.index))
