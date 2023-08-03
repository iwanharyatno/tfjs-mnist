import { loadData } from './data.js';
import model from './model.js';

async function trainModel() {
  model.weights.forEach(w => {
   console.log(w.name, w.shape);
  });

  const [trainDs, testDs] = await loadData();
  console.log('>begin training; epochs=5, batchSize=30');
  const info = await model.fitDataset(trainDs, {
    epochs: 5,
    validationData: testDs,
    verbose: 1
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
