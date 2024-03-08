const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');



const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
var cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));

const userRoutes = require('./routes/user');
app.use(userRoutes);

const expenseRoutes = require('./routes/expense');
app.use(expenseRoutes);

const purchaseRoutes = require('./routes/purchase');
app.use(purchaseRoutes);

app.use(errorController.get404);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


