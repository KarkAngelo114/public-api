// This is the route file
// to use this file, ensure that you register this route in your App.js and import the necessary controller

const express = require('express');
const router = express.Router();
const rate_limiter = require('../middlewares/express-rate-limit');
const inferenceV1 = require('../controllers/neurex-inference-controller-v1');

router.post("/classify-text", rate_limiter, inferenceV1.ClassifyText);

module.exports = router;