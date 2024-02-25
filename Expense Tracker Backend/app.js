const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const users = require('./models/user');
var cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/user/signup', async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    console.log(req.body);

    const data = await users.create({name: name, email: email, password: password })
    res.status(201).json({newSmDetail: data});

})

app.get('/user/get-signup', async (req, res, next) => {
    try {
        // const date = req.params.date;
        const smp = await users.findAll();
        res.json(smp);

    } catch (err) {
        console.log(err);
    }
})

app.use(errorController.get404);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


