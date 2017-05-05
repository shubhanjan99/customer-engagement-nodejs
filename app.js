/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env es6 */
require('dotenv').config({ silent: true });

const express = require('express');
const app = express();

// Bootstrap application settings
require('./config/express')(app);

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const toneAnalyzer = new ToneAnalyzerV3({
  // If unspecified here, the TONE_ANALYZER_USERNAME and
  // TONE_ANALYZER_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
  version_date: '2016-05-19',
});

const Cloudant = require('cloudant');
const cloudant = new Cloudant({
  account: process.env.CLOUDANT_USERNAME || 'ec1033fe-2664-40b3-81bd-9813bed3a1e9-bluemix',
  password: process.env.CLOUDANT_PASSWORD || '50c00ec7df6384c127f0e199d280f66888022b5f353f6108cca8d95f2d2ea956',
  plugin: 'promises',
});

const tonesAccuracyDb = cloudant.db.use('customer-tones-accuracy');


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/log/customer_tones_accuracy', (req, res) => {
  console.log('customer_tones_accuracy endpoint called');
  console.log('data is ' + JSON.stringify(req.body, 2, null));

  const tonesAccuracyLogEntry = {
    user_feedback: 'test',
    tone_analyzer_response: 'test',
    timestamp: (new Date(Date.now())).toISOString(),
  };

  tonesAccuracyDb.insert(tonesAccuracyLogEntry, (err, body) => {
    if (err) {
      return console.log('[db.insert] ', err.message);
    }
    console.log(body);
    // const responseData = { collectDataResponse: body };
    // console.log('app.js collect_data endpoint response to client front-end: ' + JSON.stringify(responseData, 2, null));
    // res.send(responseData);
  });
});

app.post('/api/tone_chat', (req, res, next) => {
  toneAnalyzer.tone_chat(req.body, (err, tone) => {
    if (err) {
      return next(err);
    }
    return res.json(tone);
  });
});

app.get('/healthchecks/tone_analyzer_request_test', (req, res) => {
  toneAnalyzer.tone_chat({
    utterances: [{ text: 'sad', user: 'customer' }],
  }, (err) => {
    if (err) {
      return res.status(500);
    }
    return res.status(200);
  });
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
