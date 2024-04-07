import express from 'express';
import bodyParser  from 'body-parser';
import axios from 'axios';

const port = 8080;
const app = express();
const apiUrl = "http://localhost:8081/api/v01"
let message = null;

let total = 0;


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

async function getCodeFromName(countryName){
  try{
      let apiResp = await axios.get(apiUrl+"/getCodeFromName/"+countryName);
      return apiResp.data  
  }catch(err){
    console.error(err)
  }
}

app.get("/",async (req,res)=>{
  let localMessage = message;
  message = null;
  const {countries, messageGetAll} = await getTotalCountries();
  total = countries.length;

  res.status(200).render("index.ejs",{countries, total, localMessage})
})

app.post("/add", async (req, res) => {
  let countryToAdd = req.body["countryToAdd"];
  if (countryToAdd.length > 2){
    countryToAdd = await getCodeFromName(countryToAdd);
  }
  try {
    if(countryToAdd.messageGetCode){
      message = countryToAdd.messageGetCode
    }else if (countryToAdd.countryCode){
      message = await axios.post(apiUrl + "/add", { data: countryToAdd.countryCode });
      message= message.data.messageAdd;
    }
      // Redirect after successful addition
  } catch (error) {
      message = ("Error adding country: " + error);
  }
  res.status(200).redirect("/");
});



app.listen(port,(err)=>{
  if (err) throw err;
  console.log("local server is running on port: "+port)
})