'use strict';

const router = require('express').Router();
const payment = require('../queue/payments');

router.post('/', (req, res, next) => {
  const order = req.body;
  payment.create(order, (err) => {
    if (err) {
      return res.json({
        error: err,
        success: false,
        message: 'Could not create payment',
      });
    } else {
      return res.json({
        error: null,
        success: true,
        message: 'Successfully created payment',
        order
      });
    }
  })
});

module.exports = router;