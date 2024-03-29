import pg from 'pg';
import express from 'express';

const port = 8081;
const app = express();
const client = new pg.Client({
    user: "dverves",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432
})
let quiz = [];

async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to 'postgres' database");
    } catch (error) {
        console.log("Error connecting to 'postgres' database: " + error)
    }
}

async function getAllFlags() {
    try {
        let apiRsp = await client.query("Select * from flags");
        return apiRsp.rows;
    } catch (error) {
        console.log("Error executing query: ", error);
    }
}

app.get("/api/v01/flags", async(req,res)=>{
    let dbResp = await getAllFlags();
    res.status(200).json(dbResp)
})

app.listen(port, async (err) => {
    if (err) throw err;
    await connectToDB();
    console.log("API Flag server is running on port: " + port);
})