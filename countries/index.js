import express from 'express';
import bodyParser from 'body-parser';
import axios from "axios";


const port = 8080;
const app = express();
const apiBasicUrl = "http://localhost:8081/api/v01"



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

async function getNextQuestion(){
    try{
        let apiResp = await axios.get(apiBasicUrl+"/next-question");
        apiResp = apiResp.data
        return apiResp
    }catch(error){
        console.error(error);
    }
    return null;
}

async function getVariants(){
    try{
        let apiResp = await axios.get(apiBasicUrl+"/variants");
        return apiResp.data
    }catch(error){
        console.log(error);
    }
    return null
}

async function checkVariants(nextQ, vars) {
    // Check if any of the existing variants have the same capital as the next question
    const isCapitalPresent = vars.nextVars.some(variant => variant.capital === nextQ.nextQ.capital);
  
    if (!isCapitalPresent) {
      // If not present, replace a random variant (excluding the first one)
      const randomIndex = Math.floor(Math.random() * (vars.nextVars.length - 1)) + 1; // Exclude first element (index 0)
      vars.nextVars[randomIndex] = nextQ.nextQ;
    }
  
    return vars;
  }
  

app.get("/", async (req,res)=>{
    let nextQuestion = await getNextQuestion();
    let nextVariants = await getVariants();
    console.log("********************");
    console.log(nextQuestion);
    nextVariants = await checkVariants(nextQuestion, nextVariants);
    console.log(nextVariants);

    // console.log(nextVariants);
    res.status(200).render("index.ejs",{nextQuestion, nextVariants})
})


app.listen(port,(err)=>{
    if (err) throw err;
    console.log("local server is running on port: "+port);
})