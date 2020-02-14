const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._limit = options.limit;
    this._totalSize = 0;
  }

  _transform(chunk, encoding, callback) {

    this._totalSize = this._totalSize + chunk.length;
    if (this._totalSize > this._limit) {
      const err = new LimitExceededError();
      callback(err);
      // this._destroy(err, callback);
    } else {
      this.push(chunk);
      callback();
    }
    // callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
