var path = require('path');
var fs = require('fs');
var cron = require('node-cron');
var queueManager = require('../providers/queueManagerProvider');
var converterProvider = require('../providers/converterProvider');
var fileManagerProvider = require('../providers/fileManagerProvider');
var emailServiceProvider = require('../providers/emailServiceProvider');
var request = require('request');
var task;

function processVoicesWithSQS() {
    queueManager.reviewMessages(function (filesToProcess) {
        filesToProcess.forEach(function (fileInfo, index) {
            var fileToProcess = JSON.parse(fileInfo.body);
            var updateStatusUrl = process.env.VOX_SERVICE_URL + '/api/voices/' + fileToProcess.id + '/converted';
            console.log('processVoicesWithSQS : fileName: ' + fileToProcess.name + ' fileExtension: ' + fileToProcess.extension);
            queueManager.deleteMessage(fileInfo.receiptHandle);
            if (fileToProcess.extension === '.mp3') {
                var source = process.env.VOX_BUCKET_URL + '/repository/original/' + fileToProcess.name + fileToProcess.extension;
                var destinyKey = 'repository/converted/' + fileToProcess.name + '.mp3';
                fileManagerProvider.copyFile(source, destinyKey, function () {
                    var emailTo = fileToProcess.name.substr(37);
                    request.put(updateStatusUrl);
                    emailServiceProvider.sendEmail(emailTo);
                    queueManager.deleteMessage(fileInfo.receiptHandle);
                });
            } else {
                converterProvider.convertFile(fileToProcess, function (tempOutPath) {
                    fileManagerProvider.saveFile(tempOutPath, 'repository/converted/' + fileToProcess.name + ".mp3", function () {
                        var emailTo = fileToProcess.name.substr(37);
                        request.put(updateStatusUrl);
                        emailServiceProvider.sendEmail(emailTo);
                        queueManager.deleteMessage(fileInfo.receiptHandle);
                    });
                });
            }
        });
    });
}

function getBatchConverterName() {
    if (process.env && process.env.VOX_USE_FILE_SERVER) {
        return 'batchConverterProduction.bat';
    }
    return 'batchConverter.bat';
}

function processVoicesWithBatch() {
    var name = Date.now();
    require('child_process').exec('START "cron" /B /D "' + path.join(__dirname, 'batch') + '" ' + getBatchConverterName() + ' ' + name, function (err, stdout, stderr) {
        if (err) {
            console.log(stderr);
        }
    });
}


function startJobVox() {
    if (process.env && process.env.VOX_QUEUE_URL && process.env.VOX_BUCKET_NAME) {
        console.log('processVoicesWithSQS ' + Date.now());
        task = cron.schedule('*/10 * * * * *', processVoicesWithSQS);
    } else {
        console.log('processVoicesWithBatch ' + Date.now());
        task = cron.schedule('*/10 * * * * *', processVoicesWithBatch);
    }
}

function stopJobVox() {
    if (task) {
        task.stop();
        task = undefined;
    }
}

function isLive() {
    if (task) {
        response.isLive = true;
    }
}

exports.startJobVox = startJobVox;
exports.stopJobVox = stopJobVox;
exports.isLive = isLive;
