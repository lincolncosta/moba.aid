from random import random
from operator import itemgetter
import pandas as pd
from ObjectiveFunction import objective_function
from CreateSolution import create_node
import sys
import random as rndm

global iterations

COMPOSITION_STRATEGY = sys.argv[1]


def extends_neighborhood(current):

    # Implementar moeda pra ver se o sinal será + ou -

    coin = rndm.randint(1, 2)

    if coin == 1:
        # neighbor1
        neighbor1 = current.copy()
        neighbor1[0] = neighbor1[0]+1
        check_clone(neighbor1)
    else:
        # neighbor1
        neighbor1 = current.copy()
        neighbor1[0] = neighbor1[0]-1
        check_clone(neighbor1)

    coin = rndm.randint(1, 2)

    if coin == 1:
        # neighbor2
        neighbor2 = current.copy()
        neighbor2[1] = neighbor2[1]+1
        check_clone(neighbor2)
    else:
        # neighbor2
        neighbor2 = current.copy()
        neighbor2[1] = neighbor2[1]-1
        check_clone(neighbor2)

    coin = rndm.randint(1, 2)

    if coin == 1:
        # neighbor3
        neighbor3 = current.copy()
        neighbor3[2] = neighbor3[2]+1
        check_clone(neighbor3)
    else:
        # neighbor3
        neighbor3 = current.copy()
        neighbor3[2] = neighbor3[2]-1
        check_clone(neighbor3)

    coin = rndm.randint(1, 2)

    if coin == 1:
        # neighbor4
        neighbor4 = current.copy()
        neighbor4[3] = neighbor4[3]+1
        check_clone(neighbor4)
    else:
        # neighbor4
        neighbor4 = current.copy()
        neighbor4[3] = neighbor4[3]-1
        check_clone(neighbor4)

    coin = rndm.randint(1, 2)

    if coin == 1:
        # neighbor4
        neighbor5 = current.copy()
        neighbor5[4] = neighbor5[4]+1
        check_clone(neighbor5)
    else:
        # neighbor4
        neighbor5 = current.copy()
        neighbor5[4] = neighbor5[4]-1
        check_clone(neighbor5)

    neighborhood = [neighbor1, neighbor2, neighbor3, neighbor4, neighbor5]

    return neighborhood


def check_clone(solution):
    sol = []
    for id in solution:
        if id not in sol:
            sol.append(id)
        else:
            sol.append(1+int(99*random()))
    return sol


def counter_local_max(current_solution, last_solution, counter):
    # print('last_solution: ', last_solution)
    # print('current_solution: ', current_solution)
    # print('counter: ', counter)
    if (current_solution == last_solution):
        counter += 1
        return counter
    else:
        return 1


# Criar check_local_max()
# Reiniciar após preso por mais de 10 iterações (MAX_ITERATIONS_LOCAL)
# Reiniciar no máximo 5 vezes (MAX_RESET)
def hc_process(iterations):
    MAX_ITERATIONS_LOCAL = 10
    MAX_RESET = 5

    reset_counter = 1
    reset_local_max_counter = 1

    best_global_fit = 0
    best_global_individual = []

    while (reset_counter < MAX_RESET):
        print('INICIANDO O RESET NÚMMERO {}'.format(reset_counter))

        current = create_node()
        reset_local_max_counter = 1

        c = 0
        while (c < iterations):
            neighborhood = extends_neighborhood(current)
            last_solution = current
            for sol in neighborhood[0:len(neighborhood)]:
                fit_current = objective_function(
                    current, COMPOSITION_STRATEGY)
                fit_neighbor = objective_function(
                    sol, COMPOSITION_STRATEGY)

                # print("current solution:", current, "| fit:", str(fit_current))
                # print("neighbor", sol, "| fit:", str(fit_neighbor))
                # print()
                if (fit_neighbor >= fit_current):
                    current = sol.copy()
                    if fit_neighbor >= best_global_fit:
                        best_global_fit = fit_neighbor
                        best_global_individual = current
                # current = sol.copy() if (fit_neighbor >= fit_current) else current
                # print('reset_local_max_counter: ', reset_local_max_counter)
            c += 1
            reset_local_max_counter = counter_local_max(
                current, last_solution, reset_local_max_counter)
            if reset_local_max_counter == MAX_ITERATIONS_LOCAL:
                break
            print("New current:", current, "| fit:", str(fit_current))
        reset_counter += 1

    print("final solution:", best_global_individual,
          "| fit:", str(best_global_fit))
    return current


hc_process(100)
