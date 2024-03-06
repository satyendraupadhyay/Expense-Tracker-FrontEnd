const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');
// const bcrypt = require('bcrypt');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
var cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/user');
app.use(userRoutes);

const expenseRoutes = require('./routes/expense');
app.use(expenseRoutes);

// app.post('/user/signup', async (req, res, next) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.password;

//     console.log(req.body);

//     const saltRounds = 10;

//     bcrypt.hash(password, saltRounds, async (err, hash) => {
//         console.log(err);
//         const data = await users.create({name: name, email: email, password: hash });
//         res.status(201).json({newSmDetail: data});

//     })

// })

// app.get('/user/get-signup', async (req, res, next) => {
//     try {
//         // const date = req.params.date;
//         const user = await users.findAll();
//         res.json(user);

//     } catch (err) {
//         console.log(err);
//     }
// })

// app.post('/user/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Find the user by email
//         const user = await users.findOne({ where: { email } });

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         // Compare the entered password with the stored hashed password
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (passwordMatch) {
//             // Passwords match, user is authenticated
//             res.json({ id: user.id, name: user.name, email: user.email }); // Send back user information if needed
//         } else {
//             // Passwords do not match
//             res.status(401).json({ message: 'User not authorized' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


app.use(errorController.get404);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


