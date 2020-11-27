const { maxBy, random, times, sample, sampleSize } = require('lodash');

class Individual {
  constructor(genome) {
    this._fitness = { value: 0 };
    this._genome = genome.map(gene => ({ value: gene }));
  }
  set genome(genome) {
    genome.forEach((gene, i) => {
      this._genome[i].value = gene;
    });
  }
  get genome() {
    return this._genome.map(gene => gene.value);
  }
  set fitness(fitness) {
    this._fitness.value = fitness;
  }
  get fitness() {
    return this._fitness.value;
  }
}

class GeneticAlgorithm {
  constructor(populationSize, problem, mutationRate = 0.001) {
    this.mutationRate = mutationRate;
    this.problem = problem;
    this.populate(populationSize, problem);
    this.mostFit = this.population[0];
  }
  populate(populationSize, problem) {
    const { dimentions, min, max } = problem;
    this.population = times(populationSize, () => {
      const genome = times(dimentions, () => random(min, max, true));
      return new Individual(genome);
    });
  }
  evolve() {
    //calculate fitness before this
    const currentMostFit = maxBy(this.population, i => i.fitness);
    if (currentMostFit.fitness > this.mostFit.fitness) this.mostFit = currentMostFit;
    this.population = this.population.sort((a, b) => a.fitness - b.fitness);
    const bestHalfStart = Math.floor(this.population.length / 2);
    for (let i = 0; i < bestHalfStart; i += 2) {
      const parents = sampleSize(this.population.slice(bestHalfStart), 2);
      [this.population[i].genome, this.population[i + 1].genome] = this.breed(parents);
    }
    this.mutate();
  }
  breed(parents) {
    const genome1 = [];
    const genome2 = [];
    for (let i = 0; i < this.problem.dimentions; i++) {
      genome1.push(sample(parents).genome[i]);
      genome2.push(sample(parents).genome[i]);
    }
    return [genome1, genome2];
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

module.exports = { GeneticAlgorithm };

// function fitness(genome) {
//   // let sum = 0;
//   // genome.forEach(gene => (sum -= gene ** 2));
//   // return sum;
//   let z = genome.length * 10;
//   genome.forEach(gene => {
//     z = z + gene ** 2 - 10 * Math.cos(2 * Math.PI * gene);
//   });
//   return -z;
// }
// const ga = new GeneticAlgorithm(200, { min: -5.12, max: 5.12, dimentions: 20 }, 0.001);
// for (let i = 0; i < 4000; i++) {
//   ga.population.forEach(individual => (individual.fitness = fitness(individual.genome)));
//   ga.evolve();
//   console.log(-ga.mostFit.fitness);
// }
// console.log(-ga.mostFit.fitness);
