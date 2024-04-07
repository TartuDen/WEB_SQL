import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import pg from 'pg';





const port = 8081;
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

async function getAllData() {
    try {
        const res = await pool.query('SELECT * FROM visited_countries');
        dataFromDB = res.rows;
        return dataFromDB.map(item => item.country_code);
    } catch (err) {
        console.error(err);
        // You might want to handle the error here or propagate it further
        throw err;
    }
}

async function addData(dataToAdd) {
    try {
        // Check if the data already exists in the database
        const existingData = await pool.query('SELECT * FROM visited_countries WHERE country_code = $1', [dataToAdd]);

        if (existingData.rows.length > 0) {
            console.log(`Data for country code '${dataToAdd}' already exists in the database.`);
            return; // Exit the function without adding duplicate data
        }

        // Insert the data into the database
        const res = await pool.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [dataToAdd]);
        console.log("Data Successfully added at: " + new Date().toLocaleString());
    } catch (err) {
        console.error(err);
        // You might want to handle the error here or propagate it further
        throw err;
    }
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/v01", async (req, res) => {
    dataFromDB = await getAllData();
    res.status(200).json(dataFromDB);
})

app.post("/api/v01/add", async (req, res) => {
    await addData(req.body.data)
    res.status(201).json({message: "added"})
})


app.listen(port, (err) => {
    if (err) throw err;
    console.log("api server is running on port: " + port);
})