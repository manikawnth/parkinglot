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


app.get('/', function(req, res) {
    console.log("Entered home page");
    res.sendFile('index.html', { root: __dirname + '/client' });
})

app.get('/lot',function(req,res){
	if(req.query.id == 'all'){
		res.json(lots);
	}

})

app.get('/dev',function(req,res){
	if(req.query.id == 'all'){
		res.json(lot_devices);
	}
})

app.get('/veh',function(req,res){
	if(req.query.id){
		resp = {'veh':vehicles[req.query.id]};
		res.json(resp);
	}
})


app.post('/lot',function(req,res){
	var lotid = req.query.lotid;
	var devid = req.query.devid;
	if(lotid && devid && lots[devid] ){
	    lots[devid] = lotid;
	}    
	res.json(lots);		

})

app.post('/checkin',function(req,res){
	var lotid = req.body.lotid;
	var mva = req.body.mva;
	var miles = req.body.miles;
	var gas = req.body.gas
	
	checkin.mva = mva;
	checkin.miles = miles;
	checkin.gas = gas;
	res.status(200).end();
})


app.get('/checkin',function(req,res){
	var lotid = req.query.lotid;
	res.json(checkin[lotid]);

})
app.listen(port, function() {
    console.log("Server is listening on port " + port);
})

var lot_devices = {
	'00:1A:7D:DA:71:14':'LOT1',
	'60:1A:7D:DA:71:15':'DUMMY2',
	'80:1A:7D:DA:71:14':'DUMMY3'
}

var vehicles = {
	'A0:02:DC:51:49:F9' : '068543219'
}

var lots = {
    '00:1A:7D:DA:71:14': 'A11',
    '60:1A:7D:DA:71:15': 'A22',
    '80:1A:7D:DA:71:14': 'B12'
}

var checkin = {
	'00:1A:7D:DA:71:14' : { mva:' ' , miles:' ',gas:' '}
}