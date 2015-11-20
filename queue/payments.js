'use strict';

let redisConfig;
if (process.env.NODE_ENV === 'production') {
  redisConfig = {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      auth: process.env.REDIS_PASS,
      options: {
        no_ready_check: false
      }
    }
  };
} else {
  redisConfig = {};
}

const kue = require('kue');
const queue = kue.createQueue(redisConfig);
queue.watchStuckJobs(1000 * 10);

queue.on('ready', () => {
  console.info('Queue is ready!');
});

queue.on('error', (err) => {
  console.error('There was an error in the main queue!');
  console.error(err);
  console.error(err.stack);
});


// Set up UI
kue.app.listen(process.env.KUE_PORT);
kue.app.set('title', 'Kue');

function createPayment(data, done) {
  queue.create('payment', data)
    .priority('critical')
    .attempts(8)
    .backoff(true)
    .removeOnComplete(false)
    .save(err => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

// Process up to 20 jobs concurrently
queue.process('payment', 20, function(job, done){
  // other processing work here
  // ...
  // ...

  // Call done when finished
  done();
});

module.exports = {
  create: (data, done) => {
    createPayment(data, done);
  }
};