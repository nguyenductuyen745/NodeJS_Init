const newsRouter = require('./news');
const meController = require('./me');
const coursesRouter = require('./courses');
const siteRouter = require('./site');

function route(app) {
  app.use('/news', newsRouter);
  app.use('/me', meController);
  app.use('/courses', coursesRouter);

  app.use('/', siteRouter);
}

module.exports = route;
