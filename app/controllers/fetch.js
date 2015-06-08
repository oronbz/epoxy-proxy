var fetcher = require('../services/fetcher');
var urlsDecoder = require('../helpers/urlsDecoder');

var fetchController = {
  index: function(req, res) {
    // test urls
    /*
    var urls = [
      'https://safe-inlet-8105.herokuapp.com/payout',
      'https://safe-inlet-8105.herokuapp.com/payments',
      'https://safe-inlet-8105.herokuapp.com/plans',
      'http://www.w3schools.com/xml/note.xml'
    ];
    */
    // test base 64 string
    // var urlsBase64String = 'Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ==';

    /*
     example urls: 
     http://localhost:3000/api/fetch/Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ/appended?errors=replace&timeout=300
     http://localhost:3000/api/fetch/Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ/combined?errors=fail_any&timeout=2000
     http://localhost:3000/api/fetch/Ww0KICAgImh0dHBzOi8vc2FmZS1pbmxldC04MTA1Lmhlcm9rdWFwcC5jb20vcGF5b3V0IiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BheW1lbnRzIiwNCiAgICJodHRwczovL3NhZmUtaW5sZXQtODEwNS5oZXJva3VhcHAuY29tL3BsYW5zIiwNCiAgICJodHRwOi8vd3d3Lnczc2Nob29scy5jb20veG1sL25vdGUueG1sIg0KXQ/appended
    */
    urls = urlsDecoder.decode(req.params.encoded_urls);
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
        // we can decide whether to send error to client or not, I choose to not
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