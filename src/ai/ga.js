const { maxBy, random, times, sample, sampleSize } = require('lodash');

class Individual {
  constructor(genome, fitness = 0) {
    this._fitness = { value: fitness };
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
  constructor(populationSize, problem, mutationRate = 0.01) {
    this.mutationRate = mutationRate;
    this.problem = problem;
    this.populate(populationSize, problem);
  }
  isFirstIteration = true;
  populate(populationSize, problem) {
    const { dimentions, min, max } = problem;
    this.population = times(populationSize, () => {
      const genome = times(dimentions, () => random(min, max, true));
      const individual = new Individual(genome);
      const range = Math.abs(min - max);
      individual.velocity = times(dimentions, () => random(-range, range, true));
      individual.bestGenome = individual.genome;
      return individual;
    });
    this.population.forEach(individual => {
      individual.fitness = fitness(individual.genome);
      individual.bestFitness = individual.fitness;
    });

    const genome = times(dimentions, () => random(min, max, true));
    this.mostFit = new Individual(genome);
    const best = maxBy(this.population, i => i.fitness);
    this.mostFit.genome = best.genome;
    this.mostFit.fitness = best.fitness;
  }
  evolve() {
    //calculate fitness before this

    this.population.forEach(particle => {
      particle.genome.forEach((gene, i) => {
        const rp = Math.random();
        const rg = Math.random();
        const w = 1;
        const phi_p = 1;
        const phi_g = 1;
        particle.velocity[i] =
          w * particle.velocity[i] +
          phi_p * rp * (particle.bestGenome[i] - gene) +
          phi_g * rg * (this.mostFit.genome[i] - gene);
      });
      particle.genome = particle.genome.map(
        (gene, i) => gene + particle.velocity[i] * this.mutationRate,
      );
      this.population.forEach(individual => (individual.fitness = fitness(individual.genome)));
      if (particle.fitness > particle.bestFitness) {
        particle.bestFitness = particle.fitness;
        particle.bestGenome = particle.genome;

        if (particle.bestFitness > this.mostFit.fitness) {
          this.mostFit.fitness = particle.bestFitness;
          this.mostFit.genome = particle.bestGenome;
        }
      }
    });
  }
}

module.exports = { GeneticAlgorithm };

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
const ga = new GeneticAlgorithm(200, { min: -5.12, max: 5.12, dimentions: 20 }, 0.1);
for (let i = 0; i < 4000; i++) {
  ga.population.forEach(individual => (individual.fitness = fitness(individual.genome)));
  ga.evolve();
  // console.log(ga.population.map(x => x.fitness));
  console.log(-ga.mostFit.fitness);
}
console.log(-ga.mostFit.fitness);

// for each particle i = 1, ..., S do
//     Initialize the particle's position with a uniformly distributed random vector: xi ~ U(blo, bup)
//     Initialize the particle's best known position to its initial position: pi ← xi
//     if f(pi) < f(g) then
//         update the swarm's best known position: g ← pi
//     Initialize the particle's velocity: vi ~ U(-|bup-blo|, |bup-blo|)
// while a termination criterion is not met do:
//     for each particle i = 1, ..., S do
//         for each dimension d = 1, ..., n do
//             Pick random numbers: rp, rg ~ U(0,1)
//             Update the particle's velocity: vi,d ← ω vi,d + φp rp (pi,d-xi,d) + φg rg (gd-xi,d)
//         Update the particle's position: xi ← xi + lr vi
//         if f(xi) < f(pi) then
//             Update the particle's best known position: pi ← xi
//             if f(pi) < f(g) then
//                 Update the swarm's best known position: g ← pi
