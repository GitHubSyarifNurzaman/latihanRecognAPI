'use strict';

const tf = require('@tensorflow/tfjs-node');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'your-bucket-name';
const modelFileName = 'model.json';

let model;

const loadModel = async () => {
  if (!model) {
    const file = storage.bucket(bucketName).file(modelFileName);
    const [contents] = await file.download();
    model = await tf.loadGraphModel(`file://${contents}`);
  }
  return model;
};

exports.predict = async (image) => {
  const model = await loadModel();
  const tensor = tf.node.decodeImage(image, 3).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
  const prediction = model.predict(tensor);
  const result = prediction.dataSync()[0];

  return result > 0.5 ? 'Cancer' : 'Non-cancer';
};
