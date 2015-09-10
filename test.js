
'use strict';
var test = require('tape');
var FirstN = require('./');
var Transform = require('readable-stream').Transform;

test('see if it works', function (t) {
  t.plan(8);
  var state1 = 0;
  var first3 = new Transform({
    objectMode: true,
    transform: function (chunk, _, next) {
      state1++;
      t.equals(chunk, state1, `chunk: ${chunk}, state1: ${state1}`);
      next();
    },
    flush: function (next) {
      setTimeout(function () {
        t.ok(true, 'flush1');
        next();
      });
    }
  });
  var state2 = 3;
  var next3 = new Transform({
    objectMode: true,
    transform: function (chunk, _, next) {
      state2++;
      t.equals(chunk, state2, `chunk: ${chunk}, state2: ${state2}`);
      next();
    },
    flush: function (next) {
      t.ok(true, 'flush2');
      next();
    }
  });
  var splitter = new FirstN(3, first3);
  splitter.pipe(next3);
  splitter.write(1);
  splitter.write(2);
  splitter.write(3);
  splitter.write(4);
  splitter.write(5);
  splitter.write(6);
  splitter.end();
});


test('works with a callback', function (t) {
  t.plan(6);
  function first3(err, resp) {
    t.notOk(err, 'no error');
    t.deepEquals(resp, [1, 2, 3], 'got first three');
  }
  var state2 = 3;
  var next3 = new Transform({
    objectMode: true,
    transform: function (chunk, _, next) {
      state2++;
      t.equals(chunk, state2, `chunk: ${chunk}, state2: ${state2}`);
      next();
    },
    flush: function (next) {
      t.ok(true, 'flush2');
      next();
    }
  });
  var splitter = new FirstN(3, first3);
  splitter.pipe(next3);
  splitter.write(1);
  splitter.write(2);
  splitter.write(3);
  splitter.write(4);
  splitter.write(5);
  splitter.write(6);
  splitter.end();
});
