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
      console.log(dataFromDB);
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
    console.log(data)
    res.status(200).json(data);
})


app.listen(port,(err)=>{
    if (err) throw err;
    console.log("api server is running on port: "+port);
})