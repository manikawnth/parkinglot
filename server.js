var express = require('express');
var app = express();
var port = process.env.PORT || 4040;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(express.static('client'));

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());


app.get('/',function(req,res){
	console.log("Entered home page");
	res.sendFile('index.html',{root:__dirname + '/client'});
})



app.listen(port,function(){
	console.log("Server is listening on port " + port);
})