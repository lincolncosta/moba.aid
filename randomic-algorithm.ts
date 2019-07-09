const fs = require("fs");
const json = require("./champions.json");

const generateRandomPosition = (): number => {
  return Math.floor(Math.random() * 141) + 1;
};

const randomic = () => {
  let chromosome: number[] = [];
  let control = 0;
  let current;
  let finalFitness = 0;

  for (let x = 0; x < 5; x++) {
    while (chromosome.find(item => item === control) || control === 0) {
      current = json[generateRandomPosition()];
      if (current) control = current.id;
    }

    finalFitness += current.stats.attackdamage + current.stats.movespeed;
    chromosome.push(control);
  }

  fs.appendFileSync(
    "reports/randomic.csv",
    chromosome + "\t fit = " + finalFitness.toFixed(2) + "\r\n"
  );
};

for (let x = 0; x < 100; x++) {
  randomic();
}
