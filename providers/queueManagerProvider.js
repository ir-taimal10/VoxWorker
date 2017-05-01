// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials
AWS.config.update({
    accessKeyId: process.env.VOX_SERVICES_ACCESS_KEY_ID,
    secretAccessKey: process.env.VOX_SERVICES_SECRET_KEY,
    region: 'us-west-2'
});
// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: process.env.VOX_QUEUE_URL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
};

exports.deleteMessage = function (receiptHandle) {
    var deleteParams = {
        QueueUrl: process.env.VOX_QUEUE_URL,
        ReceiptHandle: receiptHandle
    };
    sqs.deleteMessage(deleteParams, function (err, data) {
        if (err) {
            console.log("Delete Error", err);
        } else {
            // console.log("Message Deleted", data);
        }
    });
};

exports.reviewMessages = function (done) {
    sqs.receiveMessage(params, function (err, data) {
        if (err) {
            console.log("Receive Error", err);
        } else {
            var messages = [];
            if (data && data.Messages) {
                console.log('queueManagerProvider : reviewMessages : Messages.length ', data.Messages.length);
                data.Messages.forEach(function (message, index) {

                    messages.push({
                        body: message.Body,
                        receiptHandle: message.ReceiptHandle
                    });
                    //deleteMessage(message.ReceiptHandle)
                });
            }
            done(messages);
        }
    });
};

exports.getQueueAttributes = function (done) {
    sqs.getQueueAttributes({
        QueueUrl: process.env.VOX_QUEUE_URL, /* required */
        AttributeNames: [
            'All'
        ]
    }, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);           // successful response
            done(data);
        }
    });
};

