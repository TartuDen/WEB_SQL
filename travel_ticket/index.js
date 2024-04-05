import express from 'express';
import bodyParser  from 'body-parser';
import axios from 'axios';

const port = 8080;
const app = express();
const apiUrl = "http://localhost:8081/api/v01"
let countries = [];
let total = 0;
let error = null;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

async function getTotalCountries(){
  try{
    let apiResp = await axios.get(apiUrl);
    return apiResp.data
  }catch(error){
    console.log("Faild to getTotalCountries(): "+error);
  }
}

function validateInput(input) {
  // Check if input is a string and has length 2
  if (typeof input !== 'string' || input.length !== 2) {
    return false;
  }

  // Check if input consists only of letters A-Z
  return /^[A-Za-z]{2}$/.test(input);
}


app.get("/",async (req,res)=>{
  countries = await getTotalCountries();
  total = countries.length;

  res.status(200).render("index.ejs",{countries, total})
})

app.post("/add",async (req,res)=>{
  let countryToAdd = req.body["countryToAdd"];
  if (!validateInput(countryToAdd)){
    console.error("Wrong input: only 2 letter are allowed");
  }else{
    try{
      let apiResp = await axios.post(apiUrl+"/add",{data: countryToAdd});
      console.log(apiResp.data);
    }catch(error){
      console.log("Error adding country: "+error);
    }
  }
})

app.listen(port,(err)=>{
  if (err) throw err;
  console.log("local server is running on port: "+port)
})