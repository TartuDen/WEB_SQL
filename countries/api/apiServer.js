// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

// Create a new PostgreSQL client instance
const client = new pg.Client({
    user: "dverves",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432
});

// Function to connect to the PostgreSQL database
async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL database");
    } catch (error) {
        console.error("Error connecting to PostgreSQL database: ", error);
    }
}

// Function to retrieve the next question from the database
async function getNextQuestion() {
    try {
        const dbRes = await client.query("SELECT * FROM countries ORDER BY RANDOM() LIMIT 6");
        return dbRes.rows;
    } catch (error) {
        console.error("Error executing query: ", error);
        return null;
    }
}

// Create an Express application
const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route handler to retrieve the next question
app.get("/api/v01/next-question", async (req, res) => {
    try {
        const nextQ = await getNextQuestion(); // Retrieve the next question
        console.log(nextQ); // Log the next question
        res.status(200).json({ nextQ });
    } catch (error) {
        console.error("Error retrieving next question:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Start the server
const port = 8081;
app.listen(port, async () => {
    await connectToDB(); // Connect to the PostgreSQL database
    console.log(`API server is running on port: ${port}`);
});
