import express, { response } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from 'passport';//Authentication middleware for Node.js.
import { Strategy as LocalStrategy } from 'passport-local'; // Strategy for username and password authentication with Passport.
import env from 'dotenv';
import GoogleStrategy from 'passport-google-oauth2';
import axios from "axios";
import cors from 'cors';


import { getUtensils, getParams, getMainTableEq, getActivityTypeFromAPI, getProcOps, postNewOp, getAllProjects, getAllTp, getProcessInitInfo, deleteProcessInitialInfo, postProcessInitialInfo } from "./public/apiCallFuncs.js";





const port = process.env.PORT || 8085;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
env.config();
app.use(session({
    secret: process.env.SESSION_SECRET || "someKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));
app.use(cors());

app.get("/api/main_table", async (req, res) => {
    let equipmentMap = await getMainTableEq();
    // console.log("........equipmentMap........\n",equipmentMap);
    res.json(equipmentMap)
})

app.listen(port, (err) => {
    if (err) {
        console.log("Error during app.listen: ", err);
        throw err;
    } else {
        console.log("Proxy server is running on port: ", port)

    }
})