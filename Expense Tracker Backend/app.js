const path = require('path');
const fs = require('fs');
require('dotenv').config();
var cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const { log } = require('console');
const helmet = require('helmet');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeature');
const filesRoutes = require('./routes/files');
const resetPasswordRoutes = require('./routes/resetpassword')
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const sequelize = require('./util/database');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a'}
);

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', { stream: accessLogStream }));

app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);
app.use(filesRoutes);
app.use('/password', resetPasswordRoutes);
app.use(errorController.get404);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()
.then(result => {
    app.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
});


