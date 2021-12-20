const mongoose = require('mongoose');
// {
//   "id": 1,
//   "content": "Awesome idea! Trying to find framework-specific projects within the hubs can be tedious",
//   "user": {
//     "image": "/assets/user-images/image-suzanne.jpg",
//     "name": "Suzanne Chang",
//     "username": "upbeat1811"
//   }
// }

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'A Comment must have content'],
  },
  user: {
    type: Object,
    required: [true, 'A Comment must have a user'],
  },
  replies: [Object],
});

const Comment = new mongoose.model('Comment', CommentSchema);
module.exports = Comment;
