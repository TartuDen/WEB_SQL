import express, { response } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from 'passport';//Authentication middleware for Node.js.
import { Strategy as LocalStrategy } from 'passport-local'; // Strategy for username and password authentication with Passport.
import env from 'dotenv';
import GoogleStrategy from 'passport-google-oauth2';
import axios from "axios";
import cors from 'cors';


import { getUtensils, getParams, getMainTableEq, getAllProjTpVers, getActivityTypeFromAPI, getProcOps, postNewOp, getAllProjects, getAllTp, getProcessInitInfo, deleteProcessInitialInfo, postProcessInitialInfo } from "./public/apiCallFuncs.js";
import { GetBR } from "./public/apiMOCK.js";





const port = process.env.PORT || 8086;
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

async function organizeData(memory) {
    const rawData = memory;
    const organizedData = [];
  
    // Helper function to find or create a project
    function findOrCreateProject(projectName) {
      let project = organizedData.find(p => p.project === projectName);
      if (!project) {
        project = { project: projectName, tps: [] };
        organizedData.push(project);
      }
      return project;
    }
  
    // Helper function to find or create a tp
    function findOrCreateTp(project, tpName) {
      let tp = project.tps.find(t => t.tp === tpName);
      if (!tp) {
        tp = { tp: tpName, versions: [] };
        project.tps.push(tp);
      }
      return tp;
    }
  
    // Helper function to find or create a version
    function findOrCreateVersion(tp, versionName) {
      let version = tp.versions.find(v => v.version === versionName);
      if (!version) {
        version = { version: versionName };
        tp.versions.push(version);
      }
      return version;
    }
  
    rawData.forEach(record => {
      const project = findOrCreateProject(record.project);
      const tp = findOrCreateTp(project, record.tp);
      findOrCreateVersion(tp, record.version);
    });
  
    return organizedData;
  }

app.get("/api/main_table", async (req, res) => {
    let equipmentMap = await getMainTableEq();
    let memory = await getAllProjTpVers();
    let projTpVers = await organizeData(memory);


    res.json({equipmentMap, projTpVers, memory})
})

app.listen(port, (err) => {
    if (err) {
        console.log("Error during app.listen: ", err);
        throw err;
    } else {
        console.log("Proxy server is running on port: ", port)

    }
})