import express from 'express';
import bodyParser from 'body-parser';
import axios from "axios";
import session from 'express-session';


const port = 8080;
const app = express();
const apiBasicUrl = "http://localhost:8081/api/v01";
let globalAnsw = null;
let nextSeqCountries = [];
let nextSeqFlags = [];
let score = 0;


app.use(session({
    secret: "123",
    resave: false,
    saveUninitialized: true
}))
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
    return {};
}
async function getNextFlag(){
    try{
        let apiResp = await axios.get(apiBasicUrl+"/flags");
        apiResp = apiResp.data
        return apiResp
    }catch(error){
        console.error(error);
    }
    return {};
}

async function checkVariants(nextQ, vars) {
    // Check if any of the existing variants have the same capital as the next question
    const isCapitalPresent = vars.some(variant => variant.capital === nextQ.capital);
  
    if (!isCapitalPresent) {
      // If not present, replace a random variant (excluding the first one)
      const randomIndex = Math.floor(Math.random() * (vars.length - 1)) + 1; // Exclude first element (index 0)
      vars[randomIndex] = nextQ;
    }
  
    return vars;
  }

  async function checkVariantsF(nextQ, vars) {
    // Check if any of the existing variants have the same capital as the next question
    const isCapitalPresent = vars.some(variant => variant.name === nextQ.name);
  
    if (!isCapitalPresent) {
      // If not present, replace a random variant (excluding the first one)
      const randomIndex = Math.floor(Math.random() * (vars.length - 1)) + 1; // Exclude first element (index 0)
      vars[randomIndex] = nextQ;
    }
  
    return vars;
  }
  
 
app.post("/answCountry",(req,res)=>{
    let clientAnsw = req.body.answer;
    let correctAnsw = req.body.correctAnsw;
    if(correctAnsw === clientAnsw){
        console.log("clinetAnsw:",clientAnsw),
        console.log("correctAnsw:",correctAnsw);
        globalAnsw = true;
        score=score+1
    }else{
        globalAnsw = false;
        score=0;

    }
    res.status(200).redirect("/countries")
})

app.post("/answFlags",(req,res)=>{
    let clientAnsw = req.body.answer;
    let correctAnsw = req.body.correctAnsw;
    
    if(correctAnsw === clientAnsw){
        globalAnsw = true;
        score=score+1
    }else{
        globalAnsw = false;
        score=0;

    }
    res.status(200).redirect("/flags")
})

app.get("/", async(req,res)=>{
    res.status(200).render("index.ejs",{score});
})

app.post("/", async(req,res)=>{
        res.status(200).redirect(`/${req.body.gameType}`)

})

app.get("/countries", async (req,res)=>{
    let localAnsw = globalAnsw;
    globalAnsw = null
    nextSeqCountries = await getNextQuestion();
    nextSeqFlags = await getNextFlag();
    console.log(nextSeqCountries);
    console.log(nextSeqFlags);
    let nextQuestionC = await nextSeqCountries.nextQ[0];
    let nextVariants = await nextSeqCountries.nextQ.slice(1,5);

    nextVariants = await checkVariants(nextQuestionC, nextVariants);
  
    res.status(200).render("index.ejs",{nextQuestionC, nextVariants, localAnsw, score})
})

app.get("/flags",async(req,res)=>{
    let localAnsw = globalAnsw;
    globalAnsw = null
    nextSeqFlags = await getNextFlag();
    let nextQuestionF = await nextSeqFlags.nextQ[0]
    let nextVariantsF = await nextSeqFlags.nextQ.slice(1,5);
    nextVariantsF = await checkVariantsF(nextQuestionF, nextVariantsF);
    console.log(nextQuestionF);
    console.log(nextVariantsF);
    res.status(200).render("index copy.ejs",{nextQuestionF, nextVariantsF, localAnsw, score})
})



app.listen(port,(err)=>{
    if (err) throw err;
    console.log("local server is running on port: "+port);
})