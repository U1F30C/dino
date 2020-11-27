import { GeneticAlgorithm } from './ga';
import { Network } from './ann/Network';
const { weightsForArchitecture } = require('./ann/math');
const { times } = require('lodash');
export class Trainer {
  constructor(populationSize) {
    // this.population = times(populationSize, () => ({}));

    const networkArchitecture = [[2], [4, 'sigmoid'], [4, 'sigmoid'], [2, 'sigmoid']];

    this.ga = new GeneticAlgorithm(populationSize, {
      dimentions: weightsForArchitecture(networkArchitecture.map(([n]) => n)),
      min: -10,
      max: 10,
    });
    this.population = this.ga.population.map((individual, i) => {
      individual.brain = Network(networkArchitecture);
      individual.brain.distributeWights(this.ga.population[i]._genome);
      return individual;
    });
  }
  async train() {
    this.ga.evolve();
  }
}
