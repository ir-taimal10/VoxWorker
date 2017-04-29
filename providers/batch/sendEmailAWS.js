const commandLineArgs = require('command-line-args')
var aws = require('aws-sdk');
const voiceProvider = require('../../../Services/app/providers/voiceProvider');
var request = require('request');

const optionDefinitions = [
    { name: 'fileName', alias: 'f', type: String, multiple: false }
];

const options = commandLineArgs(optionDefinitions);

var emailTo;
var voiceGuid;

if (options.fileName){
    emailTo = options.fileName.substr(37, options.fileName.length - 3);
    voiceGuid = options.fileName.substr(0, 36);
}

aws.config.loadFromPath('config.json');
var ses = new aws.SES({apiVersion: '2010-12-01'});

var params = {
    Destination: {
        ToAddresses: [emailTo]
    },
    Message: {
        Body: {
            Html: {
                Data: '<b>Hola,</b><br><br><b>Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.</b><br><p>Atte: El equipo Vox.</p>',
                Charset: 'utf-8'
            },
            Text: {
                Data: 'Hola, Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.',
                Charset: 'utf-8'
            }
        },
        Subject: {
            Data: 'Vox - Archivo de audio procesado',
            Charset: 'utf-8'
        }
    },
    Source: 'vox.bot.cloud@gmail.com'
};

/*ses.sendEmail(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
});*/

if (voiceGuid){
    request.put('http://VoxELBDeployModelC-1062338425.us-west-2.elb.amazonaws.com/api/voices/' + voiceGuid + '/converted');
}
