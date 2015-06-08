var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();

// configuration
app.set('port', process.env.PORT || 3000);
// app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// routes
require('./app/routes')(app);

// listen
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});