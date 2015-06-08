// decode base64 string to urls array
function decode(b64string) {
  var buf = new Buffer(b64string, 'base64');
  return JSON.parse(buf.toString());
}

module.exports = {
  decode: decode
};