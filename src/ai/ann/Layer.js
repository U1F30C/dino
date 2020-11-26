import { Neuron } from "./../utils/Neuron";

function Layer([size, activation]) {
  let layer = {
    neurons: Array.from(Array(size)).map((_) => Neuron(1, activation)),
    error: Infinity,
    predict,
  };
  function predict(inputs) {
    layer.output = layer.neurons.map((neuron) => neuron.predict(inputs));
    return layer.output;
  }
  return layer;
}

export { Layer };
