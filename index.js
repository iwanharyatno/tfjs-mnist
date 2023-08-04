import { loadData } from './data.js';
import model from './model.js';

const epochs = 5;
const batchSize = 30;

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
        console.log('>batch', batch, log);
      }
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
