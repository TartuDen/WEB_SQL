import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';


const port  = 8081;
const app = express();
let data = ["FR","ES"];


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/api/v01",async (req,res)=>{
    res.status(200).json(data);
})


app.listen(port,(err)=>{
    if (err) throw err;
    console.log("api server is running on port: "+port);
})