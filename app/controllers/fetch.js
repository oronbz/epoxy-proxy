var fetcher = require('../services/fetcher');

var fetchController = {
  index: function(req, res) {
    /*    var result = {
      name: 'Oron',
      Age: 28
    }*/

    var options = {
      strategy: 'combined'
    };

    fetcher.fetch(null, options, function(err, results) {
      res.json(results);
    });
    
  }
};

module.exports = fetchController;