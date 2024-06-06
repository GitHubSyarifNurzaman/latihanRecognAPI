'use strict';

const predictController = require('../controllers/predictController');

module.exports = [
  {
    method: 'POST',
    path: '/predict',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 1000000,
        allow: 'multipart/form-data',
        multipart: true,
      },
      handler: predictController.predict,
    },
  },
];
