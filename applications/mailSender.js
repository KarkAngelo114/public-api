require('dotenv').config();
const nodemailer = require('nodemailer');
const Mailjet = require('node-mailjet');
const env = process.env.ENVIRONMENT;
const mail_jet_api_key = process.env.MAIL_JET_API_KEY;
const mail_jet_secret_key = process.env.MAIL_JET_SECRET_KEY;
const mail_jet_sender_email = process.env.MAIL_JET_SENDER_EMAIL;

/**
 * @function GMail_Sender
 * @param {String} recipientEmail - the email of the recipient
 * @param {String} senderEmail - the name of the sender
 * @param {String} message  - message to sent
 * @param {String} subject - Subject of the email
 * @param {boolean} replyTo - allows replies to the email
 * @param {boolean} verbose_logs - shows logs. Set the value to "false" if to toggle logs. Default value is "true"
 *
 * Allows you to send Gmails to your recipients. `GMail_Sender()` might not work on platforms that outbound ports are blocked, consider using `MailJet` or use The default exported `MailSender()` function
 */

const GMail_Sender = async (recipientEmail, senderEmail, message, subject, replyTo = null, verbose_logs = true) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_SENDER_PASSWORD
            },
            connectionTimeout: 30_000,
            greetingTimeout: 30_000,
            socketTimeout: 30_000
        });

        // verify connection configuration — will throw if network/port blocked or auth fails
        await transporter.verify();
        if (verbose_logs) console.log('SMTP transporter verified successfully');

        const mailOptions = {
            from: `${senderEmail} <${process.env.EMAIL_SENDER}>`,
            to: recipientEmail,
            subject,
            text: message,
        };

        if (replyTo) mailOptions.replyTo = replyTo;

        const result = await transporter.sendMail(mailOptions);
        if (verbose_logs) console.log('Email sent:', result.messageId);
        return result;
    } catch (err) {
        // log full error so you can inspect it in Render logs
        if (verbose_logs) console.error('GMail_Sender error:', err && (err.stack || err));
        throw err; // rethrow so upstream code / API can detect failure
    }
};


/**
 * @function MailJet
 * @param {String} recipientEmail - the email of the recipient
 * @param {String} senderEmail - the name of the sender
 * @param {String} message  - message to sent
 * @param {String} subject - Subject of the email
 * @param {boolean} replyTo - allows replies to the email
 * @param {boolean} verbose_logs - shows logs. Set the value to "false" if to toggle logs. Default value is "true"
 *
 * Allows you to send Gmails to your recipients. `MailJet()` uses the MailJet API. Ensure that have register at https://www.mailjet.com and generate your API key, secret key and verify your sender email
 */
const MailJet = async (recipientEmail, senderEmail, message, subject, replyTo = null, verbose_logs = true) => {
    try {
        const client = Mailjet.apiConnect(
            mail_jet_api_key,
            mail_jet_secret_key
        );

        const requestBody = {
            Messages: [
                {
                    From: {
                        Email: mail_jet_sender_email,
                        Name: senderEmail
                    },
                    To: [
                        {
                            Email: recipientEmail
                        }
                    ],
                    Subject: subject,
                    TextPart: message
                }
            ]
        };

        if (replyTo) {
            requestBody.Messages[0].ReplyTo = {
                Email: replyTo
            };
        }

        const result = await client.post('send', { version: 'v3.1' }).request(requestBody);

        if (verbose_logs) console.log('MailJet email sent:', result.body);
        return result.body;
    }
    catch (err) {
        if (verbose_logs) console.error(err);
        throw err;
    }
};

/**
 * @function MailSender
 * @param {String} recipientEmail - the email of the recipient
 * @param {String} senderEmail - the name of the sender
 * @param {String} message  - message to sent
 * @param {String} subject - Subject of the email
 * @param {boolean} replyTo - allows replies to the email
 * @param {boolean} verbose_logs - shows logs. Set the value to "false" if to toggle logs. Default value is "true"
 *
 * Allows you to send Gmails to your recipients. `MailSender()` automatically switch mailing services based on the `ENVIRONMENT` set on your .env file. Uses `GMail_Sender()`
 * as it's standard default mailing module which is good for local development. And uses `MailJet()` if the `ENVIRONMENT` is set to "prod". (Note: you would still need to have a Mailjet account)
 */

const MailSender = (recipientEmail, senderEmail, message, subject, replyTo = null, verbose_logs = true) => env === "local" ? 
                        GMail_Sender(recipientEmail, senderEmail, message, subject, replyTo, verbose_logs) : env === "prod" ?
                        MailJet(recipientEmail, senderEmail, message, subject, replyTo, verbose_logs) : () => {throw new Error(`"ENVIRONMENT" is improperly set. (ENVIRONMENT: ${env})`)}

module.exports = { 
    MailSender,
    MailJet,
    GMail_Sender
};
