//load our app server usisng express
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const con = mysql.createConnection({
	host: "rappelwithforesight.cik1yin3pif1.us-east-1.rds.amazonaws.com",
	user: "Cmaggio3",
	password: "IwantanA123",
	database: "RappelWithForesight"
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(morgan('short'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) =>{
    console.log("Responding to root route")
    res.send("Root")
})

app.get('/locations/:id',(req,res) =>{
	console.log("Fetching location with id: " + req.params.id)
	
	LocationID = req.params.id
	var sql = "SELECT * FROM Locations WHERE LocationID = ?";
	
	con.query(sql, LocationID, function(err, result, fields){
		if(err){
			console.log("Failed to query: " + err)
			res.sendStatus(500);
			res.end()
			throw err
		}
		res.json(result[0])
	});
})

app.get('/locations',(req,res) =>{
	console.log("Fetching all locations")
	
	var sql = "SELECT * FROM Locations;"
	
	con.query(sql,function(err,result,fields){
		if(err){
			console.log("Failed to query: " + err)
			res.sendStatus(500);
			res.end()
			throw err
		}
		res.json(result)
	});
})

app.post('/locations/',(req,res) =>{
	console.log("posting location")
	
	var valuesRaw = req.body
	var valuesRefined = ''
	valuesParsed = valuesRaw
	for(var index in valuesParsed){
		if(index == 'Markers')
		{
			valuesRefined += index + '='+JSON.stringify(valuesParsed[index])+',';
		}
		else
		{
			valuesRefined += index + '="'+valuesParsed[index]+'",';
		}
	}
	valuesRefined = valuesRefined.substring(0,valuesRefined.length-1);
	
	
	
	var query = "INSERT INTO Locations SET " + valuesRefined + " ON DUPLICATE KEY UPDATE " + valuesRefined;
	
	console.log(query)
	
	con.query(query,function(err,rows){
		if(err) {
			console.log("query Failure")
			res.json({"Error" : true, "Message" : "Error executing MySQL query"});
		} else {
			console.log("query success")
			res.json({"Error" : false, "Message" : "Success"});
		}
	});
})

//localhost:3004
app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server is up and listening...")
})
