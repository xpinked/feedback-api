const fs = require('fs');
const express = require('express');

const app = express();
const port = 4000;

const feedbacks = JSON.parse(
  fs.readFileSync(`${__dirname}/Feedbacks/Feedbacks.json`)
);
const currentuser = JSON.parse(
  fs.readFileSync(`${__dirname}/Users/CurrentUser.json`)
);

app.use(express.json());

//CURRENT USER HANDLER
app.get('/currentuser', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.status(200).send(currentuser);
});

///////FEEDBACKS HANDLERS
//Getters
app.get('/feedbacks', (req, res) => {
  // const items = feedbacks.map(feedback => {
  //   const { id, title, category, upvotes, status, description } = feedback;
  //   return { id, title, category, upvotes, status, description };
  // });
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.status(200).json(feedbacks);
});

app.get('/feedbacks/comments', (req, res) => {
  //prettier-ignore
  const items = feedbacks.filter(i => i.comments).map(feedback => feedback.comments);

  // const comments = items.map(item => item.map(i => i.content));
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.status(200).json(items);
});

app.get('/feedbacks/stats', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  const stats = feedbacks?.map(fb => fb.status);
  if (stats) {
    res
      .status(200)
      .json(req.query.unique === 'true' ? [...new Set(stats)] : stats);
    return;
  }
  res.status(404).json({ message: 'Not Found' });
});

app.get('/feedbacks/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { id } = req.params;
  const feedback = feedbacks.find(fb => fb.id === +id);
  if (feedback) {
    //const { title, category, upvotes, status, description } = feedback;
    res.status(200).json(feedback);
    return;
  }
  res.status(404).json({ message: 'Not Found' });
});

app.get('/feedbacks/:id/comments', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { id } = req.params;
  const feedback = feedbacks.find(fb => fb.id === +id);
  if (feedback) {
    const { comments } = feedback;
    comments && res.status(200).json(comments);
    return;
  }
  res.status(404).json({ message: 'Not Found' });
});

app.get('/feedbacks/:id/title', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { id } = req.params;
  const feedback = feedbacks.find(fb => fb.id === +id);

  if (feedback) {
    const { title } = feedback;
    title && res.status(200).json({ title });
    return;
  }
  res.status(404).json({ message: 'Not Found' });
});

//Posters
app.post('/feedbacks/addfeedback', (req, res) => {
  feedbacks.push(req.body);
  fs.writeFile(
    `${__dirname}/Feedbacks/Feedbacks.json`,
    JSON.stringify(feedbacks),
    err => {
      res.send('done');
    }
  );
});

//Delete
app.delete('/feedbacks/delete/:id', (req, res) => {
  const { id } = req.params;
  const feedbackID = feedbacks.find(i => i.id === +id);
  const itemIndex = feedbacks.indexOf(feedbackID);
  if (feedbackID) {
    feedbacks.splice(itemIndex, 1);
    fs.writeFile(
      `${__dirname}/Feedbacks/Feedbacks.json`,
      JSON.stringify(feedbacks),
      err => {
        res.send('done');
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Running http://127.0.0.1:${port}`);
});
