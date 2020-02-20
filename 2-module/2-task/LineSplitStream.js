const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._nextStr = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkArr = chunk.toString().split(`${os.EOL}`);

    chunkArr.forEach((string, i) => {

      if (chunkArr.length === i + 1) { // запоминаем последний или единственный эл массива
        this._nextStr += string;
      } else {
        this.push(this._nextStr += string); // прибавляем к нему следующий эл и пушим
        this._nextStr = '';
      }
    });

    callback();
  };


  _flush(callback) {
    // вызывается один раз в конце обработки стрима, пушит последний сложенный эл
    callback(null, this._nextStr);
  }
}

module.exports = LineSplitStream;
