'use strict';

const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.savePrediction = async (data) => {
  const docRef = firestore.collection('predictions').doc(data.id);
  await docRef.set(data);
};
