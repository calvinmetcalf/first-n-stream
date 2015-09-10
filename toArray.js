'use strict';
var Transform = require('readable-stream').Transform;
var inherits = require('inherits');
var once = require('once');
inherits(ToArray, Transform);

module.exports = ToArray;

function ToArray(callback) {
  Transform.call(this, {
    objectMode: true
  });
  this._cache = [];
  var cb = once(callback);
  this._callback = cb;
  this.once('error', cb);
}

ToArray.prototype._transform = function (chunk, _, next) {
  this._cache.push(chunk);
  next();
};
ToArray.prototype._flush = function (done) {
  var cb = this._callback;
  cb(null, this._cache);
  done();
};
