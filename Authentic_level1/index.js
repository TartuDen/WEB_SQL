import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import {Logger, LoggerCollection} from "./public/user_logger.js"
import { log } from 'console';
import axios from 'axios';
import bcrypt from 'bcrypt';

const app = express();
const port = 8080;



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/register",async (req,res)=>{
    const {user_name, email, password}= req.body;

    try{
        let apiResp = await axios.post("http://localhost:8081/reg_user", {user_name, email, password});
        if (apiResp.data.message){
            console.log(apiResp.data.message);
            res.redirect("/")
        } else if (apiResp){
            console.log("successfully created");
            res.redirect("/secret_page");
        }else{
            console.log("try to log in");
            res.redirect("/");
        }
    }catch(err){
        console.error("Failed to get data from ",err)
    }    

})

app.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    console.log("email: ", email, password);
    let user_logging;

    try{
        let apiResp = await axios.post("http://localhost:8081/get_user",{email,password});
        user_logging = apiResp.data;

    }catch (err) {
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`Failed to get data from /get_user: ${err.message}, Status Code: ${err.response.status}, Response Data: ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
            // The request was made but no response was received
            console.error(`Failed to get data from /get_user: ${err.message}, No response received`);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error(`Failed to get data from /get_user: ${err.message}`);
        }
    }

    if(user_logging){
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