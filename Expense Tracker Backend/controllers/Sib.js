var Sib = require('sib-api-v3-sdk');
require('dotenv').config();

var client = Sib.ApiClient.instance;

var apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY

var tranEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: 'satyendraupadya49@gmail.com'
}

const receivers = [
    {
        email: 'satyendraupadhyay.in@gmail.com'
    }
]

tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'Forgot password',
    textContent: 'Here is your password'
}).then(console.log).catch(console.log)