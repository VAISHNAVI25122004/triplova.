const twilio = require('twilio');
require('dotenv').config({ path: '../.env' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

console.log('Account SID:', accountSid);
console.log('From:', from);

const client = twilio(accountSid, authToken);

client.messages
    .create({
        from: from,
        body: 'Hello from Triplova! This is a test message.',
        to: 'whatsapp:+919566904675' // Replace with your verified number for testing
    })
    .then(message => console.log('Message Sent SID:', message.sid))
    .catch(err => {
        console.error('Twilio Error:');
        console.error('Code:', err.code);
        console.error('Message:', err.message);
        console.error('More Info:', err.moreInfo);
    });
