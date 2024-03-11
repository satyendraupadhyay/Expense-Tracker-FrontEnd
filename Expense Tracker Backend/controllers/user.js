const users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

function generateAccessToken(id, name, ispremiumuser) {
    return jwt.sign({userId: id , name: name, ispremiumuser} , 'secretkey');
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const user = await users.findOne({ where: { email } });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                res.status(200).json({ success: true, message: "User logged in successfully" , token: generateAccessToken(user.id, user.name, user.ispremiumuser)});
            } else {
                res.status(400).json({ success: false, message: "Password is incorrect" });
            }
        } else {
            res.status(400).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

module.exports.generateAccessToken = generateAccessToken;