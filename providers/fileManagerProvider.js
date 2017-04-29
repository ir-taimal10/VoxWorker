// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region
AWS.config.update({
    accessKeyId: process.env.VOX_SERVICES_ACCESS_KEY_ID,
    secretAccessKey: process.env.VOX_SERVICES_SECRET_KEY
});

s3 = new AWS.S3({apiVersion: '2006-03-01'});
var fs = require('fs');
var path = require('path');

function saveFileInS3(path, key, done) {
    var uploadParams = {
        Bucket: process.env.VOX_BUCKET_NAME,
        Key: '',
        Body: '',
        ACL: 'public-read'
    };
    var fileStream = fs.createReadStream(path);
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = key;

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        if (data) {
            console.log("fileManager : saveFileInS3 : OK ", data.Location);
        }
        fs.unlink(path);
        done(data.Location);
    });
}
function copyFileInS3(source, destinyKey, done) {
    s3.copyObject({
        Bucket: process.env.VOX_BUCKET_NAME,
        CopySource: source,
        Key: destinyKey,
        ACL: 'public-read'
    }, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            done();
            console.log("fileManager : copyFileInS3 : OK ", destinyKey);
        }
    });
}


exports.saveFile = function (path, key, done) {
    saveFileInS3(path, key, done);
};

exports.copyFile = function (path, key, done) {
    copyFileInS3(path, key, done);
};