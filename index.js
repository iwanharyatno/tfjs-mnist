import { loadData } from './data.js';
import model from './model.js';

const epochs = 5;
const batchSize = 30;

let lastTime = +new Date();

function estFromMs(ms) {
  const time = new Date(ms);
  const hours = time.getUTCHours();
  const minutes = time.getUTCMinutes();
  const seconds = time.getUTCSeconds();
  const millis = time.getUTCMilliseconds();

  return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 ? seconds + 's ' : ''}${millis > 0 ? millis + 'ms' : ''}`;
}

async function trainModel() {
  model.summary();

  const [trainDs, testDs] = await loadData();
  console.log(`>begin training; epochs=${epochs}, batchSize=${batchSize}`);
  const info = await model.fitDataset(trainDs, {
    epochs: 10,
    validationData: testDs,
    verbose: 1,
    callbacks: {
      onEpochBegin: (epoch, log) => {
        console.log('>epoch', epoch, log);
      },
      onBatchBegin: (batch, log) => {
        const deltaTimeMs = ((+new Date()) - lastTime);
        lastTime = (+new Date());
        const estMs = deltaTimeMs * (2000 - batch);
        console.log('>batch', batch, log, 'delta:', deltaTimeMs + 'ms', 'est:', estFromMs(estMs));
      },
    }
  });

  console.log('>final accuracy', info.history.acc);
  console.log('>saving model to localhost');
  await saveModel();
  console.log('>model saved');
}

async function saveModel() {
  const url = 'http://localhost:3000/uploads.php';
  await model.save(url);
}

trainModel();
