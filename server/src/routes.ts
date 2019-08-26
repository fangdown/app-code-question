const app = require('./controllers/app');
const site = require('./controllers/site');
const hotnews = require('./controllers/hotnews');
const joke = require('./controllers/xcx/joke');
const routes = {
  '/': site,
  '/api/app': app,
  '/api/hotnews': hotnews,
  '/api/xcx/joke': joke,
};

export default routes;
