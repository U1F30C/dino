const { Layer } = require('./Layer');
const { delta, mse, weightsForArchitecture } = require('./math');
const { sum, times } = require('lodash');

function Network(layerDescriptors, learningRate = 0.5) {
  let layers = [];
  let trainingData = [];
  layers = layerDescriptors.slice(1).map(Layer);
  const architecture = layerDescriptors.map(([n]) => n);

  const network = {
    layers,
    forward,
    error: Infinity,
    trainingData,
    train,
    converges,
    distributeWights,
  };
  function distributeWights(weightObjects) {
    let offset = 0;
    for (let i = 1; i < architecture.length; i++) {
      const currentLayerWeightCount = architecture[i] * (architecture[i - 1] + 1);
      layers[i - 1].distributeWights(weightObjects.slice(offset, offset + currentLayerWeightCount));
      offset += currentLayerWeightCount;
    }
  }

  function forward(inputs) {
    const layerOutputs = [layers[0].predict(inputs)];
    layers.slice(1).forEach(layer => {
      layerOutputs.push(layer.predict(layerOutputs.slice(-1)[0]));
    });
    return layerOutputs.slice(-1)[0];
  }

  function converges(acceptableError = 0.05) {
    return network.error < acceptableError;
  }

  function train() {
    const outLayer = network.layers.slice(-1)[0];
    network.trainingData.forEach(([inputs, outputs]) => {
      network.forward(inputs);
      outLayer.neurons.forEach((neuron, i) => {
        neuron.error = outputs[i] - neuron.output;
        neuron.delta = neuron.deltaFunction(neuron.output, neuron.error);
      });

      for (let l = network.layers.length - 2; l >= 0; l--) {
        network.layers[l].neurons.forEach((neuron, i) => {
          neuron.error = sum(
            network.layers[l + 1].neurons.map(function (n) {
              return n.weights[i].value * n.delta;
            }),
          );

          neuron.delta = neuron.deltaFunction(neuron.output, neuron.error);

          network.layers[l + 1].neurons.forEach(nextNeur =>
            nextNeur.adjust(learningRate * nextNeur.delta),
          );
        });
      }
    });
    network.error = mse(outLayer.neurons.map(n => n.error));
  }

  return network;
}

module.exports = { Network };

// const network = Network(
//   [
//     [2],
//     [3, 'sigmoid'],
//     [1, 'sigmoid'],
//   ],
//   0.9,
// );
// const problemSize = weightsForArchitecture([2, 3, 1]);
// const weights = times(problemSize, () => ({ value: Math.random() }));
// network.distributeWights(weights);

// const inputs = [
//   [0, 0],
//   [0, 1],
//   [1, 0],
//   [1, 1],
// ];
// const outputs = [[0], [1], [1], [0]];

// network.trainingData = inputs.map((inputSet, i) => [inputSet, outputs[i]]);

// let actualOutputs;
// let i = 0;
// while (!network.converges(0.1)) {
//   network.train();
//   actualOutputs = inputs
//     .map(input =>
//       network
//         .forward(input)
//         .map(x => Math.round(x))
//         .join(','),
//     )
//     .join(';');
//   if (i == 10000) {
//     console.log(actualOutputs);
//     console.log(network.error);
//     i = 0;
//   }
//   i++;
// }
