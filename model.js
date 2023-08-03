import tf from '@tensorflow/tfjs';

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [784], units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: 'accuracy',
});

export default model;
