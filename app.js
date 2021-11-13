const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

///Currently learning working with files after that i'll implement a DB with MongoDB
const feedbacks = JSON.parse(
  fs.readFileSync(`${__dirname}/Feedbacks/Feedbacks.json`)
);

const currentuser = JSON.parse(
  fs.readFileSync(`${__dirname}/Users/CurrentUser.json`)
);

//Middlewares
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

//   next();
// });

app.use(express.json());

const error = (req, res) => res.status(404).json({ message: 'Not Found' });

///////FEEDBACKS HANDLERS
//Getters
const getFeedbacks = (req, res) => {
  // const items = feedbacks.map(feedback => {
  //   const { id, title, category, upvotes, status, description } = feedback;
  //   return { id, title, category, upvotes, status, description };
  // });
  const m = +req.query.page;
  //prettier-ignore
  const k = req.query.count && typeof +req.query.count === 'number' ? +req.query.count: feedbacks.length;
  // const k = req.query.count && typeof +req.query.count === 'number' ? +req.query.count: 6;

  const pages = Math.ceil(feedbacks.length / k);
  if (req.query.page && typeof m === 'number' && m > 0 && m <= pages) {
    res.status(200).send(
      feedbacks
        .slice()
        .reverse()
        .slice((m - 1) * k, m * k)
    );
    return;
  }
  console.log('hello');
  res.status(200).json(feedbacks.slice().reverse().slice(0, k));
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

const getAllFeedbacksStats = (req, res) => {
  const stats = feedbacks?.map(fb => fb.status);
  if (stats) {
    res
      .status(200)
      .json(req.query.unique === 'true' ? [...new Set(stats)] : stats);
    return;
  }
  error(req, res);
};

const getFeedbackByID = (req, res) => {
  const { id } = req.params;
  const feedback = feedbacks.find(fb => fb.id === +id);
  if (feedback) {
    //const { title, category, upvotes, status, description } = feedback;
    res.status(200).json(feedback);
    return;
  }
  error(req, res);
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

const addFeedback = (req, res) => {
  if (req.body) {
    feedbacks.push(req.body);
    fs.writeFile(
      `${__dirname}/Feedbacks/Feedbacks.json`,
      JSON.stringify(feedbacks),
      err => {
        res.send('done');
      }
    );
    return;
  }
  error(req, res);
};

const deleteFeedbackByID = (req, res) => {
  const { id } = req.params;
  const feedbackID = feedbacks.find(i => i.id === +id);
  if (feedbackID && id) {
    const itemIndex = feedbacks.indexOf(feedbackID);
    feedbacks.splice(itemIndex, 1);
    fs.writeFile(
      `${__dirname}/Feedbacks/Feedbacks.json`,
      JSON.stringify(feedbacks),
      err => {
        res.send('done');
      }
    );
    return;
  }
  error(req, res);
};

//CURRENT USER HANDLER
// i know this is extreamly bad implementaion, im just learning how to work with files and basic express commands
app.get('/currentuser', (req, res) => {
  res.status(200).send(currentuser);
});

app.get('/feedbacks/amount', getFeedbacksAmount);

app.get('/feedbacks/stats', getAllFeedbacksStats);

app.get('/feedbacks/:id/comments', getCommentsOfFeedbackByID);

app.get('/feedbacks/comments', getAllComments);

app.route('/feedbacks').get(getFeedbacks).post(addFeedback);

app.route('/feedbacks/:id').get(getFeedbackByID).delete(deleteFeedbackByID);

app.listen(port, () => {
  console.log(`Running http://localhost:${port}`);
});
