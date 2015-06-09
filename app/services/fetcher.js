var request = require('request');
var xml2js = require('xml2js');

/*
  options(optional): {
    errors(optional): string['replace'(default), 'fail_any'],
    strategy(optional): string['appended'(deafult), 'combined'],
    timeout(optionl): number(ms)
  }
*/
function fetch(urls, options, next) {
  var resultsWrapper = {
    results: null
  };
  var completed = 0;
  var isError = false;

  // defaults
  var errors = 'replace';
  var strategy = 'appended';
  var timeout = null;

  if (options) {
    // override defaults

    if (options.errors) {

      // validation check, might change if there are more types
      if (options.errors !== 'replace' && options.errors !== 'fail_any') {
        return next(new Error("Invalid 'errors' options type"));
      }

      errors = options.errors;
    }
    if (options.strategy) {

      // validation check, might change if there are more types
      if (options.strategy !== 'appended' && options.strategy !== 'combined') {
        return next(new Error("Invalid 'strategy' options type"));
      }

      strategy = options.strategy; 
    }
    timeout = options.timeout || null;
  }

  for (var i = 0;i<urls.length;i++) {
    var url = urls[i];

    request({uri: url, timeout: timeout}, function(err, res, body) {
      // assumption: invalid urls, connection errors, timeouts ...
      // ... and code != 200 are handled with chosen errors option
      if (err || res.statusCode !== 200) {
        isError = true;
        addResult(resultsWrapper, 'failed', strategy);

        completed++;

        // finished all requests
        if (completed === urls.length) {
          if (errors === 'fail_any' && isError) {
            return next(null, 'failed');
          }
          return next(null, resultsWrapper.results);
        }
        
      // assumption: successful fetch returns 
      } else {
        var contentType = res.headers['content-type'];
        parseBody(body, contentType, function(err, result) {
          addResult(resultsWrapper, result, strategy);

          completed++;

          // finished all requests
          if (completed === urls.length) {
            if (errors === 'fail_any' && isError) {
              return next(null, 'failed');
            }
            return next(null, resultsWrapper.results);
          }
        });
      }
    })
  }
}

// parse body by the correct content type
// will return string if neither JSON nor XML
// assumption: epoxy will always return json (even if resource service return xml)
function parseBody(body, contentType, next) {
  switch (contentType) {
    case 'application/json':
      return next(null, JSON.parse(body));
    case 'text/xml':
    case 'application/xml':
      xml2js.parseString(body, function(err, result) {
        return next(err, result);
      });
      break;
    default:
      return next(null, body);
  }
}

// add a result to results based on aggregation strategy
function addResult(resultsWrapper, result, strategy) {

  // initialize results based on strategy
  if (!resultsWrapper.results) {
    switch (strategy) {
      case 'appended':
        resultsWrapper.results = [];
        break;
      case 'combined':
        resultsWrapper.results = {};
        break;
    }
  }

  // add result based on strategy
  switch (strategy) {
    case 'appended':
      resultsWrapper.results.push(result);
      return;
    case 'combined':
      // combine is for objects so we cannot combine if the result is string
      if (typeof(result) === 'string') {
        return;
      }
      for (var prop in result) {
        resultsWrapper.results[prop] = result[prop];
      }
      return;
  }
}

module.exports = {
  fetch: fetch
};