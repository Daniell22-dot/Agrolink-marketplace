const express = require('express');
const router = express.Router();
const { getWeatherAdvisory } = require('../controllers/weatherController');

router.get('/advisory', getWeatherAdvisory);

module.exports = router;
