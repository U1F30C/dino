import { GeneticAlgorithm } from './ga';
import { Network } from './ann/Network';
const { weightsForArchitecture } = require('./ann/math');
const { times } = require('lodash');
export class Trainer {
  constructor(populationSize) {
    // this.population = times(populationSize, () => ({}));

    const networkArchitecture = [[2], [4, 'step'], [2, 'step']];

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

const bestGenomeSoFarFor2_4_2stepArchitecture = [
  1.490333231205124,
  4.935242073306053,
  -0.8114305730385176,
  -6.984377091898013,
  -9.678558492090549,
  6.399312732780945,
  -2.1735241450040954,
  0.5852112901511575,
  -2.4717308963370277,
  -3.111177095705684,
  -4.27760733936049,
  0.4866304170340854,
  -3.0260548902908724,
  -3.6344324236983017,
  0.9492671870980285,
  0.026422413457698468,
  -2.712895113854894,
  -1.1128790410541978,
  -4.492750554099505,
  2.4425150874251234,
  -2.961236209177085,
  5.580061431941816,
];
