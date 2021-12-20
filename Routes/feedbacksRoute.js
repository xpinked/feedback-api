const express = require('express');

const controller = require('../Controllers/feedbacksController');

const feedbacksRoute = express.Router();

feedbacksRoute.get('/amount', controller.getFeedbacksAmount);

feedbacksRoute.get('/stats', controller.getAllFeedbacksStats);

feedbacksRoute.get('/:id/comments', controller.getCommentsOfFeedbackByID);

feedbacksRoute.get('/comments', controller.getAllComments);

feedbacksRoute
  .route('/')
  .get(controller.getFeedbacks)
  .post(controller.addFeedback);

feedbacksRoute
  .route('/:id')
  .get(controller.getFeedbackByID)
  .patch(controller.updateFeedback)
  .delete(controller.deleteFeedbackByID);

module.exports = feedbacksRoute;
