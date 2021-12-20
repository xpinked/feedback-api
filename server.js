const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');
const { DBController } = require('./Controllers/databaseController');
// const { fetchFeedbacks } = require('./Controllers/feedbacksController');

DBController();

const port = process.env.SERVER_PORT || 4000;
app.listen(port, () => {
  console.log(`Running http://localhost:${port}`);
});
