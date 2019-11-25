const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const tone_token = process.env.TONE_TOKEN;
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: tone_token,
  url: 'https://gateway-lon.watsonplatform.net/tone-analyzer/api'
});
  
  app.get('/tone/:text', function (req, res) {
    const text = req.params.text;
    const toneParams = {
      tone_input: { 'text': text },
      content_type: 'application/json',
    };

    toneAnalyzer.tone(toneParams)
      .then(toneAnalysis => {
        res.send(JSON.stringify(toneAnalysis, null, 2));
       })
      .catch(err => {
        console.log('error:', err);
      });
  });
  
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
  
