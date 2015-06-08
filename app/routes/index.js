var express = require('express');

var fetch = require('./fetch');

module.exports = function(app) {
  fetch(app);
};