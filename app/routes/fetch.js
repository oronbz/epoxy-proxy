var fetch = require('../controllers/fetch');

module.exports = function(app) {
  app.get('/api/fetch/', fetch.index);
}