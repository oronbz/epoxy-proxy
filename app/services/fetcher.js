var request = require('request');

/*
  batch: [{
    url: string,
    method(optional): string['GET(default)', 'POST', 'PUT'...],
    body(optional): object,
    timeout: number
  }]

  options(optional): {
    errors(optional): string['replace'(default), 'fail_any'],
    strategy(optional): string['appended'(deafult), 'combined'] 
  }
*/
function fetch(batch, options, next) {
  var resultsWrapper = {
    results: null
  };
  var completed = 0;

  // defaults
  var errors = 'replace';
  var strategy = 'appended';

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
  }


  for (var i = 0;i<batch.length;i++) {
    var batchItem = batch[i];

    request(batchItem.url, function(err, res, body) {
      if (err) {
        // handle errors
      }
      if (!err && res.statusCode == 200) {
        var result = JSON.parse(body);
        pushResult(resultsWrapper, result, strategy);
      }

      completed++;

      // finished all requests
      if (completed === batch.length) {
        next(null, resultsWrapper.results);
      }
    })
  }
}

function pushResult(resultsWrapper, result, strategy) {

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

  // push result based on strategy
  switch (strategy) {
    case 'appended':
      resultsWrapper.results.push(result);
      return;
    case 'combined':
      for (var prop in result) {
        resultsWrapper.results[prop] = result[prop];
      }
      return;
  }
}

module.exports = {
  fetch: fetch
};