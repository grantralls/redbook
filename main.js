const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
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


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/post', (req, res) =>{
  res.render('post')
});

app.post('/', (req, res) => {
  console.log(req.body.title);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log('server started on port 3000');
})
