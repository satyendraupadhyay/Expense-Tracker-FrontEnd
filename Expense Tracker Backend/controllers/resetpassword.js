const uuid = require('uuid');
const bcrypt = require('bcrypt');

var Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
            const id = uuid.v4();

            // Attach the .catch() to the createForgotpassword promise
            await user.createForgotpassword({ id, active: true }).catch(err => {
                throw new Error(err);
            });

            var client = Sib.ApiClient.instance;

            var apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;

            var tranEmailApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: 'satyendraupadya49@gmail.com'
            };

            const receivers = [
                {
                    email: 'satyendraupadhyay.in@gmail.com'
                }
            ];

            try {
                const msg = await tranEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: 'Forgot password',
                    textContent: 'Here is your password',
                    htmlContent: `<a href="http://16.16.74.234:3000/password/resetpassword/${id}">Reset password</a>`
                });
            
                if (msg && msg.messageId) {
                    return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
                } else {
                    console.error('Unexpected response from sendTransacEmail:', msg);
                    return res.status(500).json({ message: 'Error sending email', success: false });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error sending email', success: false });
            }
            
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err.message, success: false });
    }
};



const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}