import express from 'express';
import bodyParser  from 'body-parser';
import axios from 'axios';

const port = 8080;
const app = express();
const apiUrl = "http://localhost:8081/api/v01"
let countries = [];
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
      if(!apiResp.data.message){
        return apiResp.data
      }else{
        throw apiResp.data.message
      }
      
  }catch(err){
    console.error(err)
  }
}

app.get("/",async (req,res)=>{
  countries = await getTotalCountries();
  total = countries.length;

  res.status(200).render("index.ejs",{countries, total})
})

app.post("/add", async (req, res) => {
  let countryToAdd = req.body["countryToAdd"];
  if (countryToAdd.length > 2){
    countryToAdd = await getCodeFromName(countryToAdd);
  }
  try {
    if(countryToAdd === undefined){
      throw new Error("Country to add is invalid or not provided");
    }
      await axios.post(apiUrl + "/add", { data: countryToAdd });
      // Redirect after successful addition
      res.status(200).redirect("/");
  } catch (error) {
      console.log("Error adding country: " + error);
      res.status(500).send("Error adding country: " + error.message);
  }
});



app.listen(port,(err)=>{
  if (err) throw err;
  console.log("local server is running on port: "+port)
})