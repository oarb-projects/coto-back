const express = require('express')
const app = express()
const hostname = '127.0.0.1';
var port = process.env.PORT || 8080;
/*https://www.npmjs.com/package/mysql*/
var mysql      = require('mysql');
const axios = require('axios');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(__dirname + '/public'));


// const instance = axios.create({
//     baseURL: 'http://localhost/',
//     timeout: 1000,
//     port:3000,
//     headers: {'X-Custom-Header': 'foobar'}
//   });

app.get('/', (req, res) => {
    res.render ( "menu.ejs" );	
    // res.send('Hello World!'))
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
    // res.send('Hello World!'))
})

app.get('/charts', (req, res) => {
    res.render ( "charts.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    // res.send('Hello World!'))
})

app.get('/login', (req, res) => {
    res.render ( "login.ejs",{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    // res.send('Hello World!'))
})

app.post("/login",(req,res)=>{
    var fullUrl = req.protocol + '://' + req.get('host') 
    let requestUrl=`${fullUrl}/api/users`
    // console.log(req.body)
    console.log("=====requestUrl")
    console.log(requestUrl)
    // console.log(fullUrl)
    axios.get(requestUrl)
    .then(function (response) {
      // handle success
        let arr=response.data
        var item = arr.findIndex(item => item.username === req.body.name);
        console.log(item)
        if(item==-1){
            // res.json({
            //     succes:"unsuccesful"
            // })
            res.redirect("/login")
        }
        else{
            console.log(arr[item].passwords)
            if(arr[item].passwords==req.body.pass){
                // res.json({
                //     succes:"succesful"
                // })
                res.redirect("/summary")
            }
            else{
                // res.json({
                //     succes:"unsuccesful"
                // })
                res.redirect("/login")
            }
        }
    })
    .catch(function (error) {
      // handle error
          console.log(error);
        console.log("there was an error")
        res.end()
    })
})

app.get('/testinfo', (req, res) => {
    res.render ( "testinfo.ejs" ,{
        navbar:'navbar.ejs',
        footer:'footer.ejs'
    });	
    // res.send('Hello World!'))
})

app.get("/api",(req,res)=>{
    // https://www.youtube.com/watch?v=mLLUqMpf5H0
    // https://www.npmjs.com/package/morgan
    // https://www.npmjs.com/package/mysql
    // file:///C:/Users/oscar/Desktop/coto/Coto/Graficas.html
    // http://localhost:3000/login
    // http://localhost:3000/charts
    // https://www.letsbuildthatapp.com/course_video?id=3042
    // https://github.com/EvaReal/sistema-html/
    // https://github.com/ManuelRM47/Caliz/blob/master/Coto.rar
    // https://dashboard.heroku.com/apps/coto-mobile/deploy/heroku-git
    // "D:\Program Files\heroku\bin\heroku" open
    var connection = mysql.createConnection({
        host     : 'coto1.cbsgdvm2kjtb.us-west-1.rds.amazonaws.com',
        post:'3306',
        user     : 'admin',
        password : 'Cfpfk5qf',
        database : 'Coto1'
      });
      
    // connection.connect(function(err) {
    //     if (err) {
    //         console.error('error connecting: ' + err.stack);
    //         return;
    //     }
    
    //     console.log('connected as id ' + connection.threadId);
    // });
    
    connection.query('SELECT * FROM Coto1.coil_resistance;', function (error, rows, fields) {
        if (error){
            console.log("Failed to query "+ err)
            res.end()
            return
        } 
        res.json(rows)
    });
    
})

app.get("/api/:testparam",(req,res)=>{
    let param=req.params.testparam
    var connection = mysql.createConnection({
        host     : 'coto1.cbsgdvm2kjtb.us-west-1.rds.amazonaws.com',
        post:'3306',
        user     : 'admin',
        password : 'Cfpfk5qf',
        database : 'Coto1'
      });
      console.log(param)
    // connection.connect(function(err) {
    //     if (err) {
    //         console.error('error connecting: ' + err.stack);
    //         return;
    //     }
    
    //     console.log('connected as id ' + connection.threadId);
    // });
    
    connection.query(`SELECT * FROM Coto1.${param};`, function (error, rows, fields) {
        if (error){
            console.log("Failed to query "+ err)
            res.end()
            return
        } 
        res.json(rows)
    });
})

app.get("/api/users",(req,res)=>{
    var connection = mysql.createConnection({
        host     : 'coto1.cbsgdvm2kjtb.us-west-1.rds.amazonaws.com',
        post:'3306',
        user     : 'admin',
        password : 'Cfpfk5qf',
        database : 'Coto1'
      });
      console.log(param)
      connection.query(`SELECT * FROM Coto1.users;`, function (error, rows, fields) {
        if (error){
            console.log("Failed to query "+ err)
            res.end()
            return
        } 
        res.json(rows)
    });
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))