'use strict';
var Transform = require('readable-stream').Transform;
var inherits = require('inherits');
var ToArray = require('./toArray');
module.exports = HeaderStream;

inherits(HeaderStream, Transform);

function HeaderStream (size, stream) {
  if (!(this instanceof HeaderStream)) {
    return new HeaderStream(size, stream);
  }

  Transform.call(this, {
    objectMode: true
  });

  if (typeof stream === 'function') {
    stream = new ToArray(stream);
  }
  this._size = Number(size);
  if (this._size !== this._size) {
    throw new TypeError('invalid size');
  }
  if (this._size < 1) {
    throw new TypeError('size must be a positive value, got ' + size);
  }
  this._headStream = stream;
  this._sofar = 0;
  this._passThroughMode = false;
}
function passThroughMethod(chunk, _, next) {
  this.push(chunk);
  next();
}
HeaderStream.prototype._transform = function (chunk, _, next) {
  var self = this;
  this._headStream.write(chunk, function (err) {
    if (err) {
      return next(err);
    }
    self._sofar++;
    self._afterWrite(next);
  });
};
HeaderStream.prototype._afterWrite = function (next) {
  if (this._sofar < this._size) {
    return next();
  }

  this._transform = passThroughMethod;
  this._passThroughMode = true;
  this._headStream.end(function (e) {
    next(e);
  });
};
HeaderStream.prototype._flush = function (done) {
  if (this._passThroughMode) {
    return done();
  }
  this._headStream.end(function (e) {
    done(e);
  });
};
