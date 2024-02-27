const users = require('../models/user');
const bcrypt = require('bcrypt');

 exports.signup = (req, res, next) => {
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;

    const { name, email, password } = req.body;

    console.log(req.body);

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        console.log(err);
        const data = await users.create({name: name, email: email, password: hash });
        res.status(201).json({newSmDetail: data});

    })

}

exports.getSignup =  async (req, res, next) => {
    try {
        // const date = req.params.date;
        const user = await users.findAll();
        res.json(user);

    } catch (err) {
        console.log(err);
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await users.findAll({where: {email}});
    if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
            if (err) {
                res.status(500).json({success: false, message: "Something went wrong"})
            }
            if (result === true) {
                res.status(200).json({success: true, message: "User logged in successfully"})
            }
            else {
                return res.status(400).json({success: false, message: "Password is incorrect"})
            }
        })
    }
}