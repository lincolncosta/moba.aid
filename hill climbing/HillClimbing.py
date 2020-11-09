from random import random
from operator import itemgetter 
import pandas as pd
from ObjectiveFunction import objective_function
from CreateSolution import create_node

global iterations

def extends_neighborhood(current):

	#neighbor1
	neighbor1 = current.copy()
	neighbor1[0] = neighbor1[0]+1
	check_clone(neighbor1)

	#neighbor2
	neighbor2=current.copy()
	neighbor2[1] = neighbor2[1]+1
	check_clone(neighbor2)
	
	#neighbor3
	neighbor3=current.copy()
	neighbor3[2] = neighbor3[2]+1
	check_clone(neighbor3)

	#neighbor4
	neighbor4=current.copy()
	neighbor4[3] = neighbor4[3]+1
	check_clone(neighbor4)

	#neighbor4
	neighbor5=current.copy()
	neighbor5[4] = neighbor5[4]+1
	check_clone(neighbor5)
	
	neighborhood=[neighbor1,neighbor2,neighbor3,neighbor4,neighbor5]
	
	return neighborhood
		
def check_clone(solution):
	sol = []
	for id in solution:
		if id not in sol:
			sol.append(id)
		else:
			sol.append(1+int(99*random()))
	return sol

def hc_process(iterations):
	c=0
	current=create_node()
	while (c<iterations):
		neighborhood=extends_neighborhood(current)
		for sol in neighborhood[0:len(neighborhood)]:
			fit_current=objective_function(current)
			fit_neighbor=objective_function(sol)

			#print("current solution:", current, "| fit:",str(fit_current), "| estimate/h:", sprints_capacity(current))
			print("neighbor", sol,"| fit:",str(fit_neighbor))
			print()
			current=sol.copy() if (fit_neighbor>=fit_current) else current	
		c=c+1
		print("New current:", current, "| fit:",str(fit_current))
	
		
	return current

hc_process(100)
