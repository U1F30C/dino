class Individual {
  constructor(dimentions, min, max) {
    const range = max - min;
    this.genome = Array.from(Array(dimentions)).map(
      () => min + range * Math.random
    );
    this.fitness = 0;
  }
}

class GeneticAlgorithm {
  constructor(populationSize, dimentions) {
    this.populate(populationSize, dimentions);
  }
  evolve() {}
  populate(populationSize, dimentions) {
    this.population = Array.from(Array(populationSize)).map(
      () => new Individual(dimentions)
    );
  }
}
