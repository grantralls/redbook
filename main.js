const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
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

let users = [
  {
    'username': 'Grant',
    'password': 'admin'
  }
];

app.get('/', (req, res) => {
  try {
    let token = req.cookies.token;
    let data = jwt.verify(token, process.env.JWTSECRET);
    res.redirect('/home');
  } catch (err) {
    res.render('login');
  }
});

app.post('/', (req, res) => {
  let auth = users.some((user, i) => {
    if(req.body.username == user.username && req.body.password == user.password) {
      let token = jwt.sign({
        'username': user.username,
      }, process.env.JWTSECRET);
      res.cookie('token', token);
      return true;
    } else {
      return false;
    }
  });

  if(!auth) {
    return res.render('login', {message:"bad login"});
  }
  res.redirect('/home');
});

app.use('/', (req, res, next) => {
  try {
    let token = req.cookies.token;
    let data = jwt.verify(token, process.env.JWTSECRET);
    next();
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/home', (req, res) => {
  res.render('index', {name: 'Grant'});
})

app.get('/bug', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {});
