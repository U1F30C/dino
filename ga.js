const { maxBy, random, times, sample, sampleSize } = require('lodash');

class Individual {
  constructor(genome) {
    this.fitness = 0;
    this.genome = genome;
  }
}

class GeneticAlgorithm {
  constructor(populationSize, problem, mutationRate) {
    this.mutationRate = mutationRate;
    this.problem = problem;
    this.populate(populationSize, problem);
  }
  populate(populationSize, problem) {
    const { dimentions, min, max } = problem;
    this.population = times(
      populationSize,
      () => new Individual(times(dimentions, () => random(min, max, true))),
    );
  }
  evolve() {
    //calculate fitness before this
    const currentMostFit = maxBy(this.population, i => i.fitness);
    if (!this.mostFit || currentMostFit.fitness > this.mostFit.fitness)
      this.mostFit = currentMostFit;
    this.population = this.population.sort((a, b) => a.fitness - b.fitness);
    let offspring = [];
    while (offspring.length < this.population.length) {
      const parents = sampleSize(this.population.slice(this.population.length / 2), 2);
      const children = this.breed(parents);

      offspring = offspring.concat(children);
    }
    this.mutate();
    this.population = offspring;
  }
  breed(parents) {
    const breedingPoint = random(1, this.problem.dimentions);
    // const genome = [];
    // for (let i = 0; i < this.problem.dimentions; i++) {
    //   genome.push(sample(parents).genome[i]);
    // }
    const genome1 = parents[0].genome
      .slice(0, breedingPoint)
      .concat(parents[0].genome.slice(breedingPoint));
    const genome2 = parents[1].genome
      .slice(0, breedingPoint)
      .concat(parents[0].genome.slice(breedingPoint));
    return [new Individual(genome1), new Individual(genome2)];
  }
  mutate() {
    this.population.forEach(individual => {
      individual.genome = individual.genome.map(gene => {
        if (Math.random() < this.mutationRate) {
          return random(this.problem.min, this.problem.max, true);
        } else return gene;
      });
    });
  }
}

function fitness(genome) {
  // let sum = 0;
  // genome.forEach(gene => (sum -= gene ** 2));
  // return sum;
  let z = genome.length * 10;
  genome.forEach(gene => {
    z = z + gene ** 2 - 10 * Math.cos(2 * Math.PI * gene);
  });
  return -z;
}
const ga = new GeneticAlgorithm(32, { min: -5.12, max: 5.12, dimentions: 8 }, 0.2);
for (let i = 0; i < 20000; i++) {
  ga.population.forEach(individual => (individual.fitness = fitness(individual.genome)));
  ga.evolve();
  console.log(-ga.mostFit.fitness);
}
