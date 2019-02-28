//load our app server usisng express
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')

const con = mysql.createConnection({
	host: "jacobsladderintaketeam.cik1yin3pif1.us-east-1.rds.amazonaws.com",
	user: "intaketeam",
	password: "IwantanA123",
	database: "intaketeam"
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(morgan('short'))

app.get("/", (req, res) =>{
    console.log("Responding to root route")
    res.send("Root")
})

app.get('/locations/:id',(reg,res) =>{
	console.log("Fetching location with id: " + reg.params.id)
	
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

//localhost:3004
app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server is up and listening...")
})
