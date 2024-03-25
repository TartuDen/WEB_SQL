import express from 'express';
import bodyParser from 'body-parser';
import axios from "axios";
import session from 'express-session';


const port = 8080;
const app = express();
const apiBasicUrl = "http://localhost:8081/api/v01";
let globalAnsw = null;
let nextSeq = [];
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
    const isCapitalPresent = vars.some(variant => variant.capital === nextQ.capital);
  
    if (!isCapitalPresent) {
      // If not present, replace a random variant (excluding the first one)
      const randomIndex = Math.floor(Math.random() * (vars.length - 1)) + 1; // Exclude first element (index 0)
      vars[randomIndex] = nextQ;
    }
  
    return vars;
  }
  
 
app.post("/answ",(req,res)=>{
    let clientAnsw = req.body.answer;
    let correctAnsw = req.body.correctAnsw;
    if(correctAnsw === clientAnsw){
        globalAnsw = true;
        score=score+1
    }else{
        globalAnsw = false;
        score=0;

    }
    res.status(200).redirect("/")
})

app.get("/", async (req,res)=>{
    let localAnsw = globalAnsw;
    globalAnsw = null
    nextSeq = await getNextQuestion();
    console.log("*****************");

    let nextQuestion = await nextSeq.nextQ[0];
    let nextVariants = await nextSeq.nextQ.slice(1,5);

    nextVariants = await checkVariants(nextQuestion, nextVariants);
  
    // console.log(nextVariants);
    res.status(200).render("index.ejs",{nextQuestion, nextVariants, localAnsw, score})
})



app.listen(port,(err)=>{
    if (err) throw err;
    console.log("local server is running on port: "+port);
})