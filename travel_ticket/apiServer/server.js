import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import pg from 'pg';


  


const port  = 8081;
const app = express();
let data = [];
let dataFromDB;

const pool = new pg.Pool({
    user: 'dverves',
    host: 'localhost',
    database: 'postgres',
    password: '123',
    port: 5432,
  });
  pool.query('SELECT * FROM visited_countries', (err, res) => {
    if (err) {
      console.error(err);
    } else {
        dataFromDB = res.rows
    }
    // The connection is automatically released back to the pool
  });

  function extractCountryCodes(dataFromDB) {
    return dataFromDB.map(item => item.country_code);
  }

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/api/v01",async (req,res)=>{
    data = extractCountryCodes(dataFromDB);
    res.status(200).json(data);
})

app.post("/api/v01/add",async(req,res)=>{
    console.log("*********** /add ************");
    console.log(req.body.data);
})


app.listen(port,(err)=>{
    if (err) throw err;
    console.log("api server is running on port: "+port);
})