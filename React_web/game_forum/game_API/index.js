import express from 'express';
import bodyParser from 'body-parser';

const PORT = 8085;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("API server is running on port: ",PORT)
})
