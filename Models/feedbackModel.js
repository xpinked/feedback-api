const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A feedback must have a title'],
  },
  category: {
    type: String,
    required: [true, 'A feedback must have a category'],
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'suggestion',
  },
  description: {
    type: String,
    required: [true, 'A feedback must have a desctiption'],
  },
  comments: {
    type: [Object],
    default: undefined,
  },
  user: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    select: false,
  },
});

const FeedBack = mongoose.model('Feedback', FeedbackSchema);

module.exports = FeedBack;
