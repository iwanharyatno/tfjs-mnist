import tf from '@tensorflow/tfjs';

const model = tf.sequential();
model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],
  kernelSize: 3,
  filters: 16,
  activation: 'relu' 
}));
model.add(tf.layers.flatten({}));
model.add(tf.layers.dense({ units: 16, activation: 'relu' }))
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: 'accuracy',
});

export default model;
