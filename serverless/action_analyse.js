
function main(msg){
  //http request needs to block because main will return control to OpenWhisk
  //as soon as req.end() is called and callback on 'end' event will not be called.
  //Hence we use whiks.async() and whisk.done()
  var request = require('request');
  var result = "";

  var requestOpts = {
    baseUrl: 'http://iw-personalityinsights-demo.mybluemix.net',
    port: 80,
    uri: '/api/profile',
    method: 'POST',
    json: true,
    body: { text: msg.text }
  };

  request.post(requestOpts, function(err, res, body){
    if(err){
      result = err.message;
    } else {
      result = body;
    };
    whisk.done({ text: msg.text, analysis: result })
  });
/* End using request */

  return whisk.async();
}
