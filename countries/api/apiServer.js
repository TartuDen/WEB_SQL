import express from 'express';
import axios from "axios";
import bodyParser from 'body-parser';

const nextQ = {
    id: 1,
    country: "Norway",
    capital: "Oslo"
}

const nextVars = [
    {
        id: 2,
        country: "Estonia",
        capital: "Tallinn"
    },
    {
        id: 3,
        country: "Ukraine",
        capital: "Kyiv"
    },
    {
        id: 4,
        country: "Spain",
        capital: "Madrid"
    },
    {
        id: 5,
        country: "Germany",
        capital: "Berlin"
    }
]

const port = 8081;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/api/v01/next-question",(req,res)=>{
    res.status(200).json({nextQ})
})

app.get("/api/v01/variants",(req,res)=>{
    res.status(200).json({nextVars})
})

app.listen(port, (err)=>{
    if (err) throw err;
    console.log("API server is running on port: "+port)
})