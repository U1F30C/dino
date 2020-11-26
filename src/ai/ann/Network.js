import { Layer } from './Layer';
import { delta, mse } from './math';
import { sum } from 'lodash';

function Network(layerDescriptors, learningRate = 0.5) {
  let layers = [];
  layers = layerDescriptors.map(Layer);

  const network = {
    layers,
    forward,
  };

  function forward(inputs) {
    const layerOutputs = [layers[0].predict(inputs)];
    layers.slice(1).forEach(layer => {
      layerOutputs.push(layer.predict(layerOutputs.slice(-1)[0]));
    });
    return layerOutputs.slice(-1)[0];
  }

  return network;
}

export { Network };
