import matplotlib.pyplot as plt
from PIL import Image
import csv
import os


def generate_plots(labelGraph1, labelGraph2, valuesGraph1, valuesGraph2, labelX, labelY, MAX_GENERATIONS):
    fig, ax = plt.subplots()
    plt.plot(range(0, MAX_GENERATIONS + 1), valuesGraph1, label=labelGraph1)
    plt.plot(range(0, MAX_GENERATIONS + 1), valuesGraph2, label=labelGraph2)
    plt.legend()
    ax.set(xlabel=labelX, ylabel=labelY)
    plt.grid()

    fig.savefig("plot.pdf")


def save_time(times):
    with open('result_time.csv', 'wb') as myfile:
        wr = csv.writer(myfile, quoting=csv.QUOTE_ALL, delimiter='\n')
        wr.writerow(times)


def save_results(historicos):
    csvfile = open('result.csv', 'w')
    csvwriter = csv.writer(csvfile)
    for item in historicos:
        csvwriter.writerow(item[0])
    csvfile.close()


def print_population(population, POP_SIZE):
    fitnesses = [fitness_function(population[i]) for i in range(POP_SIZE)]
    print(list(zip(population, fitnesses)))


def generate_team_picture(best_global_individual, best_global_fit):
    images = []
    script_dir = os.path.dirname(os.path.abspath(__file__))

    for im in best_global_individual:
        images.append(Image.open(os.path.join(
            script_dir, 'assets/faces/' + str(im) + '.jpg')))

    widths, heights = zip(*(i.size for i in images))
    total_width = sum(widths)
    max_height = max(heights)
    new_im = Image.new('RGB', (total_width, max_height))
    x_offset = 0

    for im in images:
        new_im.paste(im, (x_offset, 0))
        x_offset += im.size[0]

    new_im.save('team-fit-' + str(best_global_fit) + '.jpg')
