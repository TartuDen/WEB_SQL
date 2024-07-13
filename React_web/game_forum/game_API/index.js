import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import {createTables, pool} from './pgTables.js'

const PORT = 8085;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Ensure tables are created on server start
async function initializeDatabase() {
    try {
        await createTables();
        console.log("Database setup complete");
    } catch (err) {
        console.error("Error setting up database:", err);
    }
}

initializeDatabase();




app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("API server is running on port: ",PORT)
})
