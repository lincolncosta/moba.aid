import pandas as pd

class Dataset:
    df = pd.read_csv('assets/dataset/dataset.csv')

    # types of role
    top = df.loc[df.lanes.str.contains('Top')]
    jungler = df.loc[df.lanes.str.contains('Jungler')]
    mid = df.loc[df.lanes.str.contains('Mid')]
    carry = df.loc[df.lanes.str.contains('Carry')]
    support = df.loc[df.lanes.str.contains('Support')]

    # get pandas and reordena indices
    top.index = range(len(top.index))
    jungler.index = range(len(jungler.index))
    mid.index = range(len(mid.index))
    carry.index = range(len(carry.index))
    support.index = range(len(support.index))
