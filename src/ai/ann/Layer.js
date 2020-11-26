const { chunk } = require('lodash');
const { Neuron } = require('./Neuron');

function Layer([size, activation]) {
  let layer = {
    neurons: Array.from(Array(size)).map(_ => Neuron(1, activation)),
    error: Infinity,
    predict,
    distributeWights,
  };
  function predict(inputs) {
    layer.output = layer.neurons.map(neuron => neuron.predict(inputs));
    return layer.output;
  }
  function distributeWights(weights) {
    chunk(weights, weights.length / layer.neurons.length).forEach((weightChunk, i) => {
      layer.neurons[i].weights = weightChunk;
    });
  }
  return layer;
}

module.exports = { Layer };
