var fetcher = require('../services/fetcher');

var fetchController = {
  index: function(req, res) {
    /*    var result = {
      name: 'Oron',
      Age: 28
    }*/

    var batch = [
      {url: 'https://safe-inlet-8105.herokuapp.com/payments'},
      {url: 'https://safe-inlet-8105.herokuapp.com/plans'}
    ];

    var options = {
      strategy: 'appended',
      errors: 'replace'
    };

    fetcher.fetch(batch, options, function(err, results) {
      if (err) {
        res.sendStatus(400);
        // TODO: log it
        console.error(err);
        return;
      }
      res.json(results);
    });
    
  }
};

module.exports = fetchController;