const commandLineArgs = require('command-line-args');
const nodemailer = require('nodemailer');
const voiceProvider = require('../../../Services/app/providers/voiceProvider');

const optionDefinitions = [
    { name: 'fileName', alias: 'f', type: String, multiple: false }
];

const options = commandLineArgs(optionDefinitions)

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vox.bot.cloud@gmail.com',
        pass: 'Batman2017'
    }
});

var emailTo;
var voiceGuid;

if (options.fileName){
    emailTo = options.fileName.substr(37, options.fileName.length - 3);
    voiceGuid = options.fileName.substr(0, 36);
}

var mailOptions = {
    from: 'vox.bot.cloud@gmail.com',
    to: emailTo,
    subject: 'Vox - Archivo de audio procesado',
    text: 'Hola, Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.',
    html: '<b>Hola,</b><br><br><b>Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.</b><br><p>Atte: El equipo Vox.</p>'
};

if (emailTo) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        else{

        }
    });
}

if (voiceGuid){
    voiceProvider.setStatus(voiceGuid, 'converted', function(err, docs){
        if(err){
            console.log(err);
        }
    });
}