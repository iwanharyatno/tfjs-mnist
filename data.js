import fs from 'fs';
import readline from 'readline';
import events from 'events';

import tf from '@tensorflow/tfjs';

async function loadPixels(path, x, y) {
  console.log('>begin reading', path);
  const read = readline.createInterface({
    input: fs.createReadStream(path),
    crlfDelay: Infinity
  });

  read.on('line', (line) => {
    const array = line.split(',');
    if (array[0] === 'label') return;
    const onehot = new Array(10).fill(0);

    x.push(array.splice(1,785).map(x => Number(x) / 255));
    onehot[array[0]] = 1;
    y.push(onehot);
  });

  await events.once(read, 'close');
  console.log('>finished reading', path);
}

async function loadData() {
  const trainX = [];
  const trainY = [];
  
  const testX = [];
  const testY = [];

  await loadPixels('./mnist_train.csv', trainX, trainY);
  console.log('>creating dataset');
  const trainXGenerator = tf.data.generator(function*() {
    for (let i = 0; i < trainX.length; i++) {
      yield tf.tensor(trainX.splice(i,1));
    }
  });
  const trainYGenerator = tf.data.generator(function*() {
    for (let i = 0; i < trainY.length; i++) {
      yield tf.tensor(trainY.splice(i,1));
    }
  });

  await loadPixels('./mnist_test.csv', testX, testY);
  console.log('>creating dataset');
  const testXGenerator = tf.data.generator(function*() {
    for (let i = 0; i < testX.length; i++) {
      yield tf.tensor(testX.splice(i,1));
    }
  });
  const testYGenerator = tf.data.generator(function*() {
    for (let i = 0; i < testY.length; i++) {
      yield tf.tensor(testY.splice(i,1));
    }
  });

  const trainDs = tf.data.zip({ xs: trainXGenerator, ys: trainYGenerator }).shuffle(100).batch(30);
  const testDs = tf.data.zip({ xs: testXGenerator, ys: testYGenerator }).shuffle(100).batch(20);

  return [trainDs, testDs];
}
// Testing
// loadData().then(result => {
//   const [trainX, trainY, testX, testY] = result;
// 
//   for (let i = 0; i < 100; i++) {
//     const index = Math.round(Math.random() * trainX.length);
//     const sampleX = trainX[index];
//     const sampleY = trainY[index];
//   
//     console.log('\nLabel: ' + sampleY.indexOf(1));
//     for (let i = 0; i < 28; i++) {
//       let offset = 28 * i;
//       for (let j = 0; j < 28; j++) {
//         process.stdout.write(sampleX[offset + j].toString().padStart(3, '0'));
//       }
//       process.stdout.write('\n');
//     }
//   }
// });

export {
  loadData
}
