const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const users = require('./models/users');
const counts = require('./models/counts');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//All the static things
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

mongoose.connect(process.env.DB, { useNewUrlParser: true });

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  let hashedPass = crypto.createHash('md5').update(req.body.password).digest('hex');
  users.findOne({ username: req.body.username }, (err, result) => {
    if(result) {
      res.render('signup', {message: "username taken"});
    } else {
      let newUser = new users({
        username: req.body.username,
        name: req.body.name,
        password: hashedPass,
        isManager: false
      });
      newUser.save();
      res.redirect('/login');
    }
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let hashedPass = crypto.createHash('md5').update(req.body.password).digest('hex');
  users.findOne({ username: req.body.username, password: hashedPass }, (err, result) => {
    if(result) {
      let token = jwt.sign({
        'username': result.username,
        'name': result.name
      }, process.env.JWTSECRET);
      res.cookie('token', token);
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});

app.use('/', (req, res, next) => {
  try {
    let token = req.cookies.token;
    res.locals.tokenData = jwt.verify(token, process.env.JWTSECRET);
    users.findOne({ username: res.locals.tokenData.username, isManager: true }, (err, result) => {
      if(result) {
        next();
      } else {
        res.redirect('/login');
      }
    });
  } catch (err) {
    res.redirect('/login');
  }
});

app.get('/', (req, res) => {
  let context = {
    name: res.locals.tokenData.name
  };
  res.render('index', context);
});

app.get('/createcount', (req, res) => {
  res.render('createcount');
});

app.post('/createcount', (req, res) => {
  let moneyAmount = [
    req.body.pennies / 2,
    req.body.nickels * 2,
    req.body.dimes * 5,
    req.body.quarters * 10,
  ];
  console.log(moneyAmount);
  let safeTotal;
  safeTotal = moneyAmount.reduce((a, b) => a + b, 0);
  safeTotal += parseInt(req.body.ones) + parseInt(req.body.fives);
  
  let context = {
    safeTotal: safeTotal,
    otherChangeFund: 399 + safeTotal 
  };

  let newCount = new counts({
    countType: req.body.countType,
    day: [{ month: req.body.month, day: req.body.day }],
    pennies: [{ rolls: req.body.pennies, moneyAmount: moneyAmount[0] }],
    nickels: [{ rolls: req.body.nickels, moneyAmount: moneyAmount[1] }],
    dimes: [{ rolls: req.body.dimes, moneyAmount: moneyAmount[2] }],
    quarters: [{ rolls: req.body.quarters, moneyAmount: moneyAmount[3] }],
    ones: [{ moneyAmount: req.body.ones }],
    fives: [{ moneyAmount: req.body.fives }],
    safeTotal: context.safeTotal,
    otherChangeFund: context.otherChangeFund,
    drawerCount: true,
    manager: res.locals.tokenData.name
  });
  newCount.save();
  res.render('createcount', context);
});

app.get('/viewcounts', (req, res) => {
  counts.find({}, (err, result) => {
    let context = {data: result};
    res.render('viewcounts', context);
  });
});

app.get('/viewcount', (req, res) => {
  counts.findOne({ _id: req.query.id }, (err, result) => {
    let context = { data: result };
    res.render('viewcount', context);
  });
});

app.listen(PORT, () => {});