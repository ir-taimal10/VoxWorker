var express = require('express');
var router = express.Router();
var cronProvider = require('../providers/cronProvider');

router.get('/api/admin/cron/start', function (req, res) {
    var response = {};
    response.success = true;

    cronProvider.stopJobVox();
    cronProvider.startJobVox();

    res.setHeader('Content-Type', 'application/json');
    res.send(response);
});

router.get('/api/admin/cron/stop', function (req, res) {
    var response = {};
    response.success = true;

    cronProvider.stopJobVox();

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
});

router.get('/api/admin/cron/isLive', function (req, res) {
    var response = {};
    response.isLive = false;

    cronProvider.isLive();

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));
});

module.exports = router;