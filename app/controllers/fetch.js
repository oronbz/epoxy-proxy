var fetcher = require('../services/fetcher');
var urlsDecoder = require('../helpers/urlsDecoder');

var fetchController = {
  index: function(req, res) {
    // decode url from encoded parameter
    urls = urlsDecoder.decode(req.params.encoded_urls);

    // set options from parameters
    var strategy = req.params.strategy;
    var errorOptions = req.query.errors;
    var timeout = null;
    if (req.query.timeout) {
      var timeout = parseInt(req.query.timeout);
    }

    var options = {
      strategy: strategy,
      errors: errorOptions,
      timeout: timeout,

    };

    fetcher.fetch(urls, options, function(err, results) {
      if (err) {
        // we can decide whether to send error to client or not, I chose to not
        res.sendStatus(400);

        // TODO: log it
        console.error(err);
        return;
      }
      if (results === 'failed') {
        return res.status(417).send('failed');
      }
      res.json(results);
    });
    
  }
};

module.exports = fetchController;