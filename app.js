var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var user = require('./Routes/userRouter.js');
var userNotes = require('./Routes/userNotesRouter.js');
var CONSTANT = require('./constant.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose
	.connect(CONSTANT.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify : false
  })
	.then(() => console.log("Database Connected"))
	.catch((err) => console.log(err));

app.use('/users', user);
app.use('/userNotes', userNotes);

app.get('/', function(req, res){
    res.send("User Login APP");
 });

app.listen(3001, function () {
    console.log("====== listing===========");
    console.log("Listening to port 3001");
  });

module.exports = app;