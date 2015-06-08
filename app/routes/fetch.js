var fetch = require('../controllers/fetch');

module.exports = function(app) {
  app.get('/api/fetch/:encoded_urls/:strategy', fetch.index);
}