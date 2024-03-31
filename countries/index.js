import express from 'express'; // Importing Express framework for building the server
import bodyParser from 'body-parser'; // Importing body-parser middleware for parsing request bodies
import axios from "axios"; // Importing Axios for making HTTP requests
import session from 'express-session'; // Importing express-session for session management

const port = 8080; // Port on which the server will listen
const app = express(); // Creating an instance of the Express application
const apiBasicUrl = "http://localhost:8081/api/v01"; // Base URL for the API server
let globalAnsw = null; // Global variable to store the answer correctness
let nextSeqCountries = []; // Array to store the next sequence of country questions
let nextSeqFlags = []; // Array to store the next sequence of flag questions
let score = 0; // Variable to store the score

// Middleware setup
app.use(bodyParser.urlencoded({extended: true})); // Parsing urlencoded request bodies
app.use(bodyParser.json());
app.use(express.static("public")); // Serving static files from the "public" directory

/**
 * Function to fetch the next country question from the API server.
 * @returns {Object} The next country question fetched from the server.
 */
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

/**
 * Function to fetch the next flag question from the API server.
 * @returns {Object} The next flag question fetched from the server.
 */
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

/**
 * Function to check and replace variants for country questions.
 * @param {Object} nextQ - The next question object.
 * @param {Array} vars - Array of variants.
 * @returns {Array} Updated array of variants.
 */
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

/**
 * Function to check and replace variants for flag questions.
 * @param {Object} nextQ - The next question object.
 * @param {Array} vars - Array of variants.
 * @returns {Array} Updated array of variants.
 */
async function checkVariantsF(nextQ, vars) {
    // Check if any of the existing variants have the same name as the next question
    const isNamePresent = vars.some(variant => variant.name === nextQ.name);
  
    if (!isNamePresent) {
      // If not present, replace a random variant (excluding the first one)
      const randomIndex = Math.floor(Math.random() * (vars.length - 1)) + 1; // Exclude first element (index 0)
      vars[randomIndex] = nextQ;
    }
  
    return vars;
}
  
/**
 * Route handler for submitting answers to country questions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post("/answCountry",(req,res)=>{
    let clientAnsw = req.body.answer;
    let correctAnsw = req.body.correctAnsw;
    if(correctAnsw === clientAnsw){
        globalAnsw = true;
        score=score+1
    }else{
        globalAnsw = false;
        score=0;
    }
    res.status(200).redirect("/countries")
})

/**
 * Route handler for submitting answers to flag questions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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

/**
 * Route handler for rendering the home page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/", async(req,res)=>{
    res.status(200).render("index.ejs",{score});
})

/**
 * Route handler for redirecting to the game type page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post("/", async(req,res)=>{
    res.status(200).redirect(`/${req.body.gameType}`)
})

/**
 * Route handler for rendering country questions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/countries", async (req,res)=>{
    let localAnsw = globalAnsw;
    globalAnsw = null
    nextSeqCountries = await getNextQuestion();
    nextSeqFlags = await getNextFlag();
    let nextQuestionC = await nextSeqCountries.nextQ[0];
    let nextVariants = await nextSeqCountries.nextQ.slice(1,5);

    nextVariants = await checkVariants(nextQuestionC, nextVariants);
  
    res.status(200).render("index.ejs",{nextQuestionC, nextVariants, localAnsw, score})
})

/**
 * Route handler for rendering flag questions.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/flags",async(req,res)=>{
    let localAnsw = globalAnsw;
    globalAnsw = null
    nextSeqFlags = await getNextFlag();
    let nextQuestionF = await nextSeqFlags.nextQ[0]
    let nextVariantsF = await nextSeqFlags.nextQ.slice(1,5);
    nextVariantsF = await checkVariantsF(nextQuestionF, nextVariantsF);
    res.status(200).render("index copy.ejs",{nextQuestionF, nextVariantsF, localAnsw, score})
})

// Start the server
app.listen(port,(err)=>{
    if (err) throw err;
    console.log("local server is running on port: "+port);
})
