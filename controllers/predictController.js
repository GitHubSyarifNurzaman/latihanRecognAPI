'use strict';

const uuid = require('uuid');
const modelService = require('../services/modelService');
const firestore = require('../utils/firestore');

exports.predict = async (request, h) => {
  const { image } = request.payload;

  if (image.bytes > 1000000) {
    return h
      .response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      })
      .code(413);
  }

  try {
    const result = await modelService.predict(image);
    const id = uuid.v4();
    const createdAt = new Date().toISOString();
    const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Tetap jaga kesehatan Anda.';

    const response = {
      id,
      result,
      suggestion,
      createdAt,
    };

    await firestore.savePrediction(response);

    return h
      .response({
        status: 'success',
        message: 'Model is predicted successfully',
        data: response,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h
      .response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      })
      .code(400);
  }
};
