// Load the AWS SDK for Node.js
var aws = require('aws-sdk');
// Load credentials and set region
aws.config.update({
    accessKeyId: process.env.VOX_SERVICES_ACCESS_KEY_ID,
    secretAccessKey: process.env.VOX_SERVICES_SECRET_KEY,
    region: 'us-west-2' //'us-east-1'
});

if (process.env.SENDGRID_API_KEY) {
    exports.sendEmail = function (emailTo) {
        if (process.env.ENABLE_SEND_EMAIL) {
            console.log('emailServiceProvider: sendEmail to: ', emailTo);
            /*var email = new sendgrid.Email();
            email.addTo(emailTo);
            email.setFrom('vox.bot.cloud@gmail.com');
            email.setSubject('Vox -SengridAddon - Archivo de audio procesado');
            email.setHtml('Hola, Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.');
            sendgrid.send(email);*/


            // using SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs
            var helper = require('sendgrid').mail;
            var fromEmail = new helper.Email('vox.bot.cloud@gmail.com');
            var toEmail = new helper.Email(emailTo);
            var subject = 'Vox - Archivo de audio procesado';
            var content = new helper.Content('text/plain', 'Hola, Su archivo de audio fue procesado y ha sido registrado exitosamente en la convocatoria de Vox.');
            var mail = new helper.Mail(fromEmail, subject, toEmail, content);

            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON()
            });

            sg.API(request, function (error, response) {
              if (error) {
                res.send('Error response received');
              }
              res.send(response.statusCode+"\n"+response.body+"\n"+response.headers);
            });

        } else {
            console.log('emailServiceProvider: sendEmail disabled,  add ENABLE_SEND_EMAIL ', emailTo);
        }
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
