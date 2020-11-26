import { dot, activations } from "./math";
import { times } from "lodash";

function Neuron(inputQuantity = 1, type = "linear") {
  let weights = times(inputQuantity + 1, Math.random);
  let neuron = {
    weights,
    predict,
    adjust,
    inputs: null,
    output: null,
    deltaFunction: activations[type].delta,
  };

  function _predict(inputs) {
    return dot(neuron.weights, inputs);
  }

  function predict(inputs) {
    inputs = [...inputs, -1];
    while (inputs.length > neuron.weights.length)
      neuron.weights.push(Math.random());
    neuron.inputs = inputs;
    neuron.output = activations[type].function(_predict(inputs));

    return neuron.output;
  }

  function adjust(delta) {
    for (let i = 0; i < neuron.weights.length; i++) {
      neuron.weights[i] += delta * neuron.inputs[i];
    }
  }

  return neuron;
}

export { Neuron };
