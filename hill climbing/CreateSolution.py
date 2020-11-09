import pandas
import random
from random import randint
import numpy as np

df = pandas.read_csv('data/bd_norm.csv')

# types of occupation
analista_req = df.loc[df.occupation == 'analista de requisitos']
devs_back = df.loc[df.occupation == 'desenvolvedor back-end']
devs_front = df.loc[df.occupation == 'desenvolvedor front-end']
testers = df.loc[df.occupation == 'teste']
scrum_masters = df.loc[df.occupation == 'scrum master']

# get pandas and reordena indices
analista_req.index = range(len(analista_req.index))
devs_back.index = range(len(devs_back.index))
devs_front.index = range(len(devs_front.index))
testers.index = range(len(testers.index))
scrum_masters.index = range(len(scrum_masters.index))


# method to create the solutions without repetitions


def create_node():
	solution = [analista_req['id'][randint(0, len(analista_req)-1)],
                  devs_back['id'][randint(0, len(devs_back)-1)],
                  devs_front['id'][randint(0, len(devs_front)-1)],
                  testers['id'][randint(0, len(testers)-1)],
                  scrum_masters['id'][randint(0, len(scrum_masters)-1)]]
	print(solution)
	return solution
