import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.status(200).render("index.ejs")
})


app.listen(port,(err)=>{
    if(err) throw err;
    console.log("Proxy server is running on port: ", port)
})