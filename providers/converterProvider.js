// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region
AWS.config.update({
    accessKeyId: process.env.VOX_SERVICES_ACCESS_KEY_ID,
    secretAccessKey: process.env.VOX_SERVICES_SECRET_KEY
});
// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
var fs = require('fs');
var path = require('path');
var ffmpegPath = path.join(__dirname, '..', 'bin', 'ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
if (process.env.VOX_SO === 'Linux') {
    ffmpegPath = "/usr/bin/ffmpeg";
}
console.log('ConverterProvider : ffmpegPath :', ffmpegPath);

exports.convertFile = function (fileToProcess, done) {
    var tempDirectory = path.join(__dirname, '..', 'files', '_tmp');
    var name = Date.now();
    var tempOutPath = path.join(tempDirectory, name + '.mp3');
    if (!fs.existsSync(tempDirectory)) {
        fs.mkdirSync(path.join(__dirname, '..', 'files'));
        fs.mkdirSync(path.join(tempDirectory));
    }
    var fileStream = s3.getObject(
        {
            Bucket: process.env.VOX_BUCKET_NAME,
            Key: 'repository/original/' + fileToProcess.name + fileToProcess.extension
        }
    ).createReadStream();

    if (process.env.VOX_SO === 'Heroku') {
        ffmpeg(fileStream)
            .toFormat('mp3')
            .on('error', function (err) {
                console.log('An error occurred: ' + err);
            })
            .on('end', function () {
                done(tempOutPath);
            })
            .save(tempOutPath);
    }
    else if (process.env.VOX_SO === 'Linux') {
        ffmpeg(fileStream)
            .setFfmpegPath(ffmpegPath)
            .toFormat('mp3')
            .on('error', function (err) {
                console.log('An error occurred: ' + err);
            })
            .on('end', function () {
                done(tempOutPath);
            })
            .save(tempOutPath);

    } else {
        ffmpeg(fileStream)
            .setFfmpegPath(ffmpegPath)
            .toFormat('mp3')
            .on('error', function (err) {
                console.log('An error occurred: ' + err);
            })
            .on('end', function () {
                done(tempOutPath);
            })
            .save(tempOutPath);
    }

};