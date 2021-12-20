const express = require('express');
const controller = require('../Controllers/roadmapsController');

const roadmapRoute = express.Router();

roadmapRoute.get('/', controller.getRoadmap);

module.exports = roadmapRoute;
