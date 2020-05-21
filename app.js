const express = require('express')
const app = express()
const hostname = '127.0.0.1';
var port = process.env.PORT || 8080;
/*https://www.npmjs.com/package/mysql*/
var mysql      = require('mysql');

app.use(express.static(__dirname + '/public'));
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
app.listen(port, () => console.log(`Example app listening on port ${port}!`))