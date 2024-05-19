import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import {Logger, LoggerCollection} from "./public/user_logger.js"
import { log } from 'console';

const app = express();
const port = 8080;
let user_logging = [];
const loggerCollection = new LoggerCollection(user_logging);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/register",(req,res)=>{
    const {user_name, email, password}= req.body;
    if(loggerCollection.getLoggerByEmail(email)){
        console.log("user already exist");
        res.redirect("/");
    }else{
        let create_user = loggerCollection.addLogger(user_name, email, password);
        console.log("successfully created");
        res.redirect("/secret_page")
    }
    

})

app.post("/login", (req,res)=>{
    const {email, password} = req.body;
    console.log("email: ", email, password)
    let getUser = loggerCollection.getLoggerByEmail(email);
    if(getUser){
        res.redirect("/secret_page")
    }else{
        res.redirect("/")
    }
})

app.get("/secret_page",(req,res)=>{
    res.status(200).render("secret_page.ejs")
})

app.get("/",(req,res)=>{
    res.status(200).render("index.ejs")
})

app.listen(port,(err)=>{
    if(err) throw err;
    console.log("Proxy server is running on port: ", port)
})