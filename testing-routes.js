// testing-routes.js

var express = require('express'),
    cache = require('./cache'),
    middlewares = require('./middlewares'),
    rack = require('hat').rack();

var router = express.Router();

// creates a unique app in the cache, with a collection prefix
function createApp(req, res) {
  var appId = rack();
  cache.apps[appId] = {
    'collectionPrefix': appId + '_',
    'masterKey': 'master'
  };
  var keys = {
    'application_id': appId,
    'client_key': 'unused',
    'windows_key': 'unused',
    'javascript_key': 'unused',
    'webhook_key': 'unused',
    'rest_api_key': 'unused',
    'master_key': 'master'
  };
  res.status(200).send(keys);
}

// deletes all collections with the collectionPrefix of the app
function clearApp(req, res) {
  if (!req.auth.isMaster) {
    return res.status(401).send({"error": "unauthorized"});
  }
  req.database.deleteEverything().then(() => {
    res.status(200).send({});
  });
}

// deletes all collections and drops the app from cache
function dropApp(req, res) {
  if (!req.auth.isMaster) {
    return res.status(401).send({"error": "unauthorized"});
  }
  req.database.deleteEverything().then(() => {
    delete cache.apps[req.config.applicationId];
    res.status(200).send({});
  });
}

// Lets just return a success response and see what happens.
function notImplementedYet(req, res) {
  res.status(200).send({});
}

router.post('/rest_clear_app',
             middlewares.handleParseHeaders, clearApp);
router.post('/rest_block',
             middlewares.handleParseHeaders, notImplementedYet);
router.post('/rest_mock_v8_client',
             middlewares.handleParseHeaders, notImplementedYet);
router.post('/rest_unmock_v8_client',
             middlewares.handleParseHeaders, notImplementedYet);
router.post('/rest_verify_analytics',
             middlewares.handleParseHeaders, notImplementedYet);
router.post('/rest_create_app', createApp);
router.post('/rest_drop_app',
             middlewares.handleParseHeaders, dropApp);
router.post('/rest_configure_app',
             middlewares.handleParseHeaders, notImplementedYet);

module.exports = {
  router: router
};