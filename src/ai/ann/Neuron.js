const { dot, activations } = require('./math');
const { times } = require('lodash');

function Neuron(inputQuantity = 1, type = 'linear') {
  let weights = times(inputQuantity + 1, () => ({ value: Math.random() }));
  let neuron = {
    weights,
    predict,
    adjust,
    inputs: null,
    output: null,
    deltaFunction: activations[type].delta,
  };

  function _predict(inputs) {
    return dot(
      neuron.weights.map(w => w.value),
      inputs,
    );
  }

  function predict(inputs) {
    fill(inputs.length);
    inputs = [...inputs, -1];
    neuron.inputs = inputs;
    neuron.output = activations[type].function(_predict(inputs));

    return neuron.output;
  }

  function adjust(delta) {
    for (let i = 0; i < neuron.weights.length; i++) {
      neuron.weights[i].value += delta * neuron.inputs[i];
    }
  }

  function fill(inputsLength) {
    while (inputsLength >= neuron.weights.length) neuron.weights.push({ value: Math.random() });
  }

  return neuron;
}

module.exports = { Neuron };
