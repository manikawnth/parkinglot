var express = require('express');
var app = express();
var port = process.env.PORT || 4040;

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(express.static('client'));

//app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

/* -----------------------------------------------------------------
						WEB-PAGE SERVICES
-------------------------------------------------------------------*/
app.get('/', function(req, res) {
    //console.log("Entered home page");
    res.sendFile('index.html', { root: __dirname + '/client' });
})

app.get('/dev', function(req, res) {
    if (req.query.id == 'all') {
        res.json(lot_devices);
    }
})

app.get('/lot', function(req, res) {
    if (req.query.id == 'all') {
        res.json(lots);
    }

})

app.post('/lot', function(req, res) {
    var lotid = req.query.lotid;
    var devid = req.query.devid;
    if (lotid && devid && lots[devid]) {
        lots[devid] = lotid;
    }
    res.json(lots);

})

app.get('/mva', function(req, res) {
    if (req.query.id == 'all') {
        res.json(vehicles);
    }
})

app.post('/mva', function(req, res) {
	var mva = req.query.mva;
	var devid = req.query.devid;
    if (mva && devid) {
        vehicles[devid] = mva;
    }
    res.json(vehicles);
})


app.get('/checkin', function(req, res) {
    var lotid = req.query.lotid;
    if(!lotid){
        res.json({});
    }
    else{
        var resp_checkin = cloneObject(checkin)
        checkin[lotid]['notified'] = 'Y'        
        res.json(resp_checkin[lotid]);    
    }
    

})

/* -----------------------------------------------------------------
						PYTHON-pi SERVICES
-------------------------------------------------------------------*/
//Get Blue-tooth adddresses and return only vehicles
app.post('/veh', function(req, res) {
    if (req.query.id) {
        resp = { 'veh': vehicles[req.query.id] };
        res.json(resp);
    } else{

        var req_veh = req.body.veh; // This is an array
        var resp_veh = { veh: [] }
        req_veh.forEach(function(bdaddr) {
            var doc = {}
            if (vehicles[bdaddr]) {
                doc[bdaddr] = vehicles[bdaddr];
                resp_veh.veh.push(doc);
            }
        })
        res.json(resp_veh);
    }
})

app.post('/checkin', function(req, res) {
    console.log(req.body);	
    var lotid = req.body.lotid;
    var mva = req.body.mva;
    var miles = req.body.miles;
    var gas = req.body.gas;

    checkin[lotid].mva = mva;
    checkin[lotid].miles = miles;
    checkin[lotid].gas = gas;
    checkin[lotid].notified = 'N';
    checkin[lotid].timestamp = (new Date()).toString();
    //console.log(checkin);
    res.status(200).end();
})


app.listen(port, function() {
    console.log("Server is listening on port " + port);
})

var lot_devices = {
    '00:1A:7D:DA:71:14': 'RPI2',
    'B8:27:EB:CD:05:88': 'RPI3',
    '60:1A:7D:DA:71:15': 'DUMMY2',
    '80:1A:7D:DA:71:14': 'DUMMY3'
}

var lots = {
    '00:1A:7D:DA:71:14': 'R12',
    'B8:27:EB:CD:05:88': 'P13',
    '60:1A:7D:DA:71:15': 'A22',
    '80:1A:7D:DA:71:14': 'B12'
}

var vehicles = {
    'A0:02:DC:51:49:F9': '068543219',
    'D0:25:98:BD:C0:3B': '894532103',
    '00:1D:A5:00:0F:B6': '045803096'
}

var checkin = {
    'B8:27:EB:CD:05:88': { mva: ' ', miles: ' ', gas: ' ', timestamp:'',notified:'' }
}

function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof(obj[i])=="object" && obj[i] != null)
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}