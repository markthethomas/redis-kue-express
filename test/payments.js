"use strict";

const request = require('supertest');
const app = require('../app');
const api = request(app);

const test = require('tape');

test(t => {
  api
    .post('/payments')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        t.fail('An error was thrown', err);
        t.end();
      };
      if (res) {
        t.ok(res.body, 'Should respond with a body');
        t.equals(res.body.received, true, 'Should have been received')
        t.end();
      }
    });
}, {
  timeout: 500
});

