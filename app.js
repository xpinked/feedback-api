const express = require('express');
const app = express();

const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const globalErrorHandler = require('./Controllers/errorController');
const feedbacksRoute = require('./Routes/feedbacksRoute');
const usersRoute = require('./Routes/usersRoute');
const roadmapRoute = require('./Routes/roadmapRoute');

//Middlewares

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

////////////////////////////////
//Routers
app.use('/feedbacks', feedbacksRoute);
app.use('/users', usersRoute);
app.use('/roadmap', roadmapRoute);

app.use(globalErrorHandler);

module.exports = app;
