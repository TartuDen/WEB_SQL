import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import {Logger, LoggerCollection} from "./public/user_logger.js"
import { log } from 'console';
import axios from 'axios';

const app = express();
const port = 8080;



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

app.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    console.log("email: ", email, password)

    try{
        let apiResp = await axios("/http://localhost:8081/get_user",{email,password});
        let user_logging = apiResp.data;
        const loggerCollection = new LoggerCollection(user_logging);
        res.session.loggerCollection = loggerCollection;
    }catch(err){
        console.error("Faild to get data from /get_user: ",err);
    }
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