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

app.get("/thread/:id", async (req, res) => {
    const threadId = req.params.id;

    try {
        const client = await pool.connect();

        // Query to get the specific thread by ID with author email and associated likes
        const result = await client.query(`
            SELECT 
                threads.id AS thread_id,
                threads.title,
                threads.genres,
                threads.created,
                threads.content,
                users.email AS author_email,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'userId', likes.userId, 
                            'threadId', likes.threadId, 
                            'postId', likes.postId, 
                            'type', likes.type
                        )
                    ) FILTER (WHERE likes.id IS NOT NULL), 
                    '[]'
                ) AS likes
            FROM threads
            JOIN users ON threads.author = users.id
            LEFT JOIN likes ON threads.id = likes.threadId
            WHERE threads.id = $1
            GROUP BY threads.id, users.email
        `, [threadId]);

        if (result.rows.length === 0) {
            res.status(404).send("Thread not found");
            return;
        }

        const thread = result.rows[0];
        client.release();

        res.status(200).json(thread);
    } catch (err) {
        console.error("error", err.message);
        res.status(500).send("Server error");
    }
});


app.get("/", async (req, res) => {
    try {
        const client = await pool.connect();
        
        // Query to get threads with author emails and associated likes
        const result = await client.query(`
            SELECT 
                threads.id AS thread_id,
                threads.title,
                threads.genres,
                threads.created,
                threads.content,
                users.email AS author_email,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'userId', likes.userId, 
                            'threadId', likes.threadId, 
                            'postId', likes.postId, 
                            'type', likes.type
                        )
                    ) FILTER (WHERE likes.id IS NOT NULL), 
                    '[]'
                ) AS likes
            FROM threads
            JOIN users ON threads.author = users.id
            LEFT JOIN likes ON threads.id = likes.threadId
            GROUP BY threads.id, users.email
        `);

        const threads = result.rows;
        client.release();

        res.status(200).json(threads);
    } catch (err) {
        console.error("error", err.message);
        res.status(500).send("Server error");
    }
});


app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("API server is running on port: ",PORT)
})
