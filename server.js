
const binance = require('node-binance-api');
var config = require('./config.json');
binance.options({
  APIKEY: config.APIKEY_IMPORT,
  APISECRET: config.APISECRET_IMPORT,
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
});
const express = require('express');
const bodyParser = require('body-parser'); // this is required for post request, or it won't work
const app = express();
const request = require('request');
const apiKey = '3eec2a0e0aafd80674a49e20786418e6';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
let weather = ""; // this crap has to be initialized becasue these template are intialized in html and node would bitch
// if this is not resolved, this has to be figued out eventually, but heay, this much for day 1. >:(
let error = "";
let menuCollection = {
  globalCoins :[],
  globalMenu: []
};

app.get('/', function (req, res) { // get crap controller
  res.render('index', {weather: null, error: null});
});



app.get('/nothing', function(req,res){ // pass the rendered page name and the values if param, just like JSP.. 
  res.render('nothing', {param: "bro this dope"});
});


// will have to refresh this like every 10/15 seconds
// write this in a service so that this will run like every 10-15 seconds
request("https://files.coinmarketcap.com/generated/search/quick_search.json",function(err,response, body){
  console.log("priting response of CMC");
  menuCollection.globalCoins = [];
  menuCollection.globalMenu = [];
  let returnVal = (JSON.parse(body));
  for (var i = 0; i < returnVal.length; i++) {
    menuCollection.globalCoins.push(returnVal[i].slug);
    menuCollection.globalMenu.push(returnVal[i].name);
  }
  
});

app.get('/menu',function(req,res){
  res.json(menuCollection);
});

app.post('/balance', function(req,res){
  var symName = req.body.name;    // {name: symbol} is passed on from the front end
  console.log("Printing balance request for "+symName);
  binance.balance((error, balances) => {
    console.log(balances);
    res.json(balances);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
