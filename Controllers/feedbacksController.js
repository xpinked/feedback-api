const fs = require('fs');
const FeedBack = require('../Models/feedbackModel');
// const { DBController } = require('./databaseController');

const feedbacks = JSON.parse(
  fs.readFileSync(`${__dirname}/../Feedbacks/Feedbacks.json`)
);

const error = (req, res) => res.status(404).json({ message: 'Not Found' });

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedBack.find();
    const m = +req.query.page;
    //prettier-ignore
    const k = req.query.count && typeof +req.query.count === 'number' ? +req.query.count: feedbacks.length;
    const pages = Math.ceil(feedbacks.length / k);
    if (req.query.page && typeof m === 'number' && m > 0 && m <= pages) {
      res.status(200).json({
        status: 'success',
        amount: feedbacks.length,
        data: feedbacks
          .slice()
          .reverse()
          .slice((m - 1) * k, m * k),
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      amount: +feedbacks.length,
      data: feedbacks.slice().reverse().slice(0, k),
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  // const m = +req.query.page;
  // //prettier-ignore
  // const k = req.query.count && typeof +req.query.count === 'number' ? +req.query.count: feedbacks.length;
  // const pages = Math.ceil(feedbacks.length / k);
  // if (req.query.page && typeof m === 'number' && m > 0 && m <= pages) {
  //   res.status(200).send(
  //     feedbacks
  //       .slice()
  //       .reverse()
  //       .slice((m - 1) * k, m * k)
  //   );
  //   return;
  // }
  // res.status(200).json(feedbacks.slice().reverse().slice(0, k));
};

const getFeedbacksAmount = (req, res) => {
  res.status(200).json(feedbacks.length);
};

const getAllComments = (req, res) => {
  //prettier-ignore
  const items = feedbacks.filter(i => i.comments).map(feedback => feedback.comments);

  // const comments = items.map(item => item.map(i => i.content));

  res.status(200).json(items);
};

const getAllFeedbacksStats = async (req, res) => {
  try {
    const feedback = await FeedBack.aggregate([
      { $match: { status: { $ne: 'suggestion' } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: feedback,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // const stats = feedbacks?.map(fb => fb.status);
  // if (stats) {
  //   res
  //     .status(200)
  //     .json(req.query.unique === 'true' ? [...new Set(stats)] : stats);
  //   return;
  // }
  // error(req, res);
};

const getFeedbackByID = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await FeedBack.findById(id);
    res.status(200).json({
      status: 'success',
      data: feedback,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // const feedback = feedbacks.find(fb => fb.id === +id);
  // if (feedback) {
  //   //const { title, category, upvotes, status, description } = feedback;
  //   res.status(200).json(feedback);
  //   return;
  // }
  // error(req, res);
};

const getCommentsOfFeedbackByID = (req, res) => {
  const { id } = req.params;
  const feedback = feedbacks.find(fb => fb.id === +id);
  if (feedback && +feedback.comments?.length > 0) {
    const { comments } = feedback;
    comments && res.status(200).json(comments);
    return;
  }
  error(req, res);
};

const addFeedback = async (req, res) => {
  try {
    const newfb = await FeedBack.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newfb,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }

  // if (req.body) {
  //   feedbacks.push(req.body);
  //   fs.writeFile(
  //     `${__dirname}/Feedbacks/Feedbacks.json`,
  //     JSON.stringify(feedbacks),
  //     err => {
  //       res.send('done');
  //     }
  //   );
  //   return;
  // }
  // error(req, res);
};

const deleteFeedbackByID = async (req, res) => {
  try {
    const { id } = req.params;
    await FeedBack.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      message: 'Deleted Succsesfully',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // const { id } = req.params;
  // const feedbackID = feedbacks.find(i => i.id === +id);
  // if (feedbackID && id) {
  //   const itemIndex = feedbacks.indexOf(feedbackID);
  //   feedbacks.splice(itemIndex, 1);
  //   fs.writeFile(
  //     `${__dirname}/Feedbacks/Feedbacks.json`,
  //     JSON.stringify(feedbacks),
  //     err => {
  //       res.send('done');
  //     }
  //   );
  //   return;
  // }
  // error(req, res);
};

const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = await FeedBack.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: updatedFeedback,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  getAllComments,
  getAllFeedbacksStats,
  getCommentsOfFeedbackByID,
  getFeedbackByID,
  getFeedbacks,
  getFeedbacksAmount,
  deleteFeedbackByID,
  addFeedback,
  updateFeedback,
};
