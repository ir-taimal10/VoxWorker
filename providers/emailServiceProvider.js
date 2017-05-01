// Load the AWS SDK for Node.js
var aws = require('aws-sdk');
// Load credentials and set region
aws.config.update({
    accessKeyId: process.env.VOX_SERVICES_ACCESS_KEY_ID,
    secretAccessKey: process.env.VOX_SERVICES_SECRET_KEY,
    region: 'us-west-2' //'us-east-1'
});

if(process.env.SENDGRID_USERNAME && process.env.SENDGRID_PASSWORD)
{
    var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

    exports.sendEmail = function(emailTo)
                        {
                          sendgrid.send({
                                          to: emailTo,
                                          from: 'vox.bot.cloud@gmail.com',
                                          subject:'Vox - Archivo de audio procesado',
                                          text: 'Hola, Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.',
                                        },
                                        function(err, json)
                                        {
                                            if(err)
                                            {
                                              return console.log(err);
                                            }
                                            console.log(json);
                                        });
                        };
}
else
{
    // Create S3 service object
    var ses = new aws.SES({apiVersion: '2010-12-01'});

    exports.sendEmail = function (emailTo) {
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

        /*ses.sendEmail(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            }
            else {
                console.log('emailServiceProvider : sendEmail : OK');
            }
        });*/
    };
}
