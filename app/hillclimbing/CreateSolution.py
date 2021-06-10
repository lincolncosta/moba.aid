import pandas
import random
from random import randint
import numpy as np
import pandas as pd

df = pd.read_csv('assets/dataset/dataset.csv')

# types of role
top = df.loc[df.lanes.str.contains('Top')]
jungler = df.loc[df.lanes.str.contains('Jungler')]
mid = df.loc[df.lanes.str.contains('Mid')]
carry = df.loc[df.lanes.str.contains('adc')]
support = df.loc[df.lanes.str.contains('Support')]

# get pandas and reordena indices
top.index = range(len(top.index))
jungler.index = range(len(jungler.index))
mid.index = range(len(mid.index))
carry.index = range(len(carry.index))
support.index = range(len(support.index))


# method to create the solutions without repetitions


def create_node():
    chromosome = [top['id'][randint(0, len(top)-1)],
                  jungler['id'][randint(0, len(jungler)-1)],
                  mid['id'][randint(0, len(mid)-1)],
                  carry['id'][randint(0, len(carry)-1)],
                  support['id'][randint(0, len(support)-1)]]
    return chromosome
