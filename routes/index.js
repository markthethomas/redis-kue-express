'use strict';

const router = require('express').Router();

router.get('/', function(req, res, next) {
  res.json({
    phrase: 'Hi!'
  });
});

module.exports = router;