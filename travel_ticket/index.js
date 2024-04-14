import express from 'express';
import bodyParser  from 'body-parser';
import axios from 'axios';
import { ServerRequests } from './public/helpersConstructor.js';

const apiUrl = "http://localhost:8081/api/v01"
const port = 8080;
const app = express();
const servReq = new ServerRequests(apiUrl);

let message = null;

let total = 0;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/",async (req,res)=>{
  let localMessage = message;
  message = null;
  
  const {countries} = await servReq.getTotalCountries();
  const users = await servReq.getUsers();
  total = countries.length;
  let tab_color = 'teal';

  res.status(200).render("index.ejs",{countries, total, localMessage, users, tab_color})
})

app.post("/",async (req,res)=>{
  let tab_color = undefined
  const {userName} = req.body;
  let localMessage = message;
  message = null;
  const {countries} = await servReq.getTotalCountries(userName);
  const users = await servReq.getUsers();
  total = countries.length;
  if (total !== 0){
    tab_color = countries[0].tab_color;
  }
  

  res.status(200).render("index.ejs",{countries, total, localMessage, users, tab_color, userName})
})

app.post("/add", async (req, res) => {
  const {countryToAdd, memberName}  = req.body;

  if (countryToAdd.length > 2){
    countryToAdd = await servReq.getCodeFromName(countryToAdd);
  }
  try {
    if(countryToAdd.messageGetCode){
      message = countryToAdd.messageGetCode

    }else{
      
      message = await axios.post(apiUrl + "/add", { data: countryToAdd, name: memberName });
      message= message.data.messageAdd;
    }
      // Redirect after successful addition
  } catch (error) {
      message = ("Error adding country: " + error);
  }
  res.status(200).redirect("/");
});

app.post("/newM",(req,res)=>{
  res.status(200).render("new_member.ejs")
})

function validateNewM(name, color){
  //perform validation for name and color
  return name, color
}

app.post("/new_member_submit",async (req,res)=>{
  const { memberName, tabColor} = req.body
  
  if (validateNewM(memberName, tabColor)){
    
    try{

      let apiResp = await axios.post(apiUrl+"/add_new_member",{memberName,tabColor});
    }catch(err){
      console.error(err)
    }
  }
  
  res.status(200).redirect("/");

})
app.listen(port,(err)=>{
  if (err) throw err;
  console.log("local server is running on port: "+port)
})