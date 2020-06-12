const express = require('express')
const app = express()
const hostname = '127.0.0.1';
var port = process.env.PORT || 8080;
var mysql      = require('mysql');
const axios = require('axios');

// body parser
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
})); 

app.use(express.json());       
app.use(express.urlencoded()); 
app.use(express.static(__dirname + '/public'));

var connection = mysql.createConnection({
    host     : 'coto-1.cjlxz9e5sgts.us-west-1.rds.amazonaws.com',
    post:'3306',
    user     : 'admin',
    password : 'cfpfk5qf',
    database : 'Coto'
});

app.get('/', (req, res) => {
    res.render ( "menu.ejs" );	
    
})

app.get('/pareto', (req, res) => {
    res.render ( "pareto.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    } );	
})

app.get('/summary', (req, res) => {
    res.render ( "summary.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    } );	
    
})

app.get('/charts', (req, res) => {
    res.render ( "charts.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    
})

app.get('/login', (req, res) => {
    res.render ( "login.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    
})

app.post("/login",(req,res)=>{
    var fullUrl = req.protocol + '://' + req.get('host') 
    let requestUrl=`${fullUrl}/api/users`
    console.log("=====requestUrl")
    console.log(requestUrl)
    axios.get(requestUrl)
    .then(function (response) {
        let arr=response.data
        var item = arr.findIndex(item => item.username === req.body.name);
        console.log(item)
        if(item==-1){      
            res.redirect("/login")
        }
        else{
            console.log(arr[item].passwords)
            if(arr[item].passwords==req.body.pass){
                res.redirect("/filter")
            }
            else{

                res.redirect("/login")
            }
        }
    })
    .catch(function (error) {
        console.log(error);
        console.log("there was an error")
        res.end()
    })
})

app.get('/filter', (req, res) => {
    res.render ( "filter.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    
})

app.get('/testinfo', (req, res) => {
    res.render ( "testinfo.ejs" ,{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    
})

app.get("/api/:testparam",(req,res)=>{
    let param=req.params.testparam
    console.log(param)    
    connection.query(`SELECT * FROM Coto.${param};`, function (error, rows, fields) {
        if (error){
            console.log("Failed to query "+ error)
            res.status(404).render('dberr.ejs');
            return
        } 
        res.json(rows)
    });
})

app.get("/api/users",(req,res)=>{
      console.log(param)
      connection.query(`SELECT * FROM Coto.users;`, function (error, rows, fields) {
        if (error){
            console.log("Failed to query "+ error)
            res.status(404).render('dberr.ejs');    
        } 
        res.json(rows)
    });
})


app.get('*', function(req, res){
    res.status(404).render('404.ejs');
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))