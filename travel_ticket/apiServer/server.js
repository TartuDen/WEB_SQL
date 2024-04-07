import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const port = 8081;
const app = express();
let dataFromDB;
let messageAdd = null;
let messageGetAll = null;
let messageGetCode = null;

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
        messageGetAll = err;;
        // You might want to handle the error here or propagate it further
        // throw err;
    }
}

async function addData(dataToAdd) {
    try {
        // Check if the data already exists in the database
        const existingData = await pool.query('SELECT * FROM visited_countries WHERE country_code = $1', [dataToAdd]);

        if (existingData.rows.length > 0) {
            messageAdd = `Data for country code already exists in the database.`;
            console.log(`Data for country code '${dataToAdd}' already exists in the database.`);
            return; // Exit the function without adding duplicate data
        }

        // Insert the data into the database
        const res = await pool.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [dataToAdd]);
        console.log("Data Successfully added at: " + new Date().toLocaleString());
        messageAdd = "Data Successfully added";
    } catch (err) {
        console.error(err);
        messageAdd = err;;
        // You might want to handle the error here or propagate it further
        // throw err;
    }
}

async function getCodeFromName(name) {
    try {
        const res = await pool.query("SELECT country_code FROM country_codes_table WHERE country_name = $1", [name]);
        if (res.rows.length > 0) {
            return res.rows[0].country_code; // Return the country code from the first row
        } else {
            return null; // Return null if no matching country code found
        }
    } catch (err) {
        console.error("Error executing query:", err);
        messageGetCode = "Error executing query:" + err;
        // // throw err; // Re-throw the error to be handled by the caller
    }
}

async function countryExists(name) {
    try {
        const res = await pool.query("SELECT COUNT(*) FROM country_codes_table WHERE country_name = $1", [name]);
       
        return res.rows[0].count > 0; 
    } catch (err) {
        console.error("Error checking country existence: ", err);
        messageGetCode = "Error checking country existence: " + err;
        // throw err;
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/api/v01/getCodeFromName/:countryName", async (req, res) => {
    let countryName = req.params.countryName;
    // Now you can use the `countryName` variable to access the value passed in the URL

    if (await countryExists(countryName)) {
        try {
            let countryCode = await getCodeFromName(countryName);
            res.status(200).json({countryCode});
        } catch (error) {
            console.error("Error retrieving country code:", error);
            messageGetCode = "Internal server error";
            res.status(500).json({ messageGetCode });
        }
    } else {
        messageGetCode = "Such country does not exist...";
        res.status(200).json({ messageGetCode });
    }
});


app.get("/api/v01", async (req, res) => {
    let countries = await getAllData();
    res.status(200).json({countries, messageGetAll});
})

app.post("/api/v01/add", async (req, res) => {
    await addData(req.body.data)

    res.status(201).json({messageAdd})
})


app.listen(port, (err) => {
    if (err) throw err;
    console.log("api server is running on port: " + port);
})