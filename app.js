const express = require('express')
const app = express()
const hostname = '127.0.0.1';
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.render ( "menu.ejs" );	
    // res.send('Hello World!'))
})
app.get('/pareto', (req, res) => {
    res.render ( "hello.ejs" );	
    // res.send('Hello World!'))
})
app.get('/summary', (req, res) => {
    res.render ( "summary.ejs" );	
    // res.send('Hello World!'))
})
app.get('/charts', (req, res) => {
    res.render ( "charts.ejs" );	
    // res.send('Hello World!'))
})

app.get('/login', (req, res) => {
    res.render ( "login.ejs" );	
    // res.send('Hello World!'))
})
app.get('/testinfo', (req, res) => {
    res.render ( "testinfo.ejs" );	
    // res.send('Hello World!'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))