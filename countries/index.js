import express from 'express';
import bodyParser from 'body-parser';

const port = 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.status(200).render("index.ejs",{})
})


app.listen(port,(err)=>{
    if (err) throw err;
    console.log("local server is running on port: "+port);
})