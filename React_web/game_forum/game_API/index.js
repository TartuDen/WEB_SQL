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
//_________________________________________________________

app.delete('/threads/:id', async (req, res) => {
    const threadId = parseInt(req.params.id);

    try {
        // Start a transaction
        const client = await pool.connect();
        await client.query('BEGIN');

        // Delete the likes associated with the thread
        await client.query('DELETE FROM likes WHERE threadId = $1', [threadId]);

        // Delete the posts associated with the thread
        await client.query('DELETE FROM posts WHERE threadID = $1', [threadId]);

        // Delete the thread itself
        const result = await client.query('DELETE FROM threads WHERE id = $1 RETURNING *', [threadId]);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).send('Thread not found');
        }

        // Commit the transaction
        await client.query('COMMIT');

        res.status(200).send('Thread deleted successfully');
    } catch (err) {
        // Rollback the transaction in case of error
        await client.query('ROLLBACK');
        console.error('Error deleting thread:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Handler to add a new thread
app.post('/add_thread_to_db', async (req, res) => {
    try {
      const { title, genres, author, created, content } = req.body;
  
      const client = await pool.connect();
  
      // First, get the author ID from the email
      const authorResult = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [author]
      );
  
      // Check if the author exists
      if (authorResult.rows.length === 0) {
        throw new Error('Author not found');
      }
  
      const authorId = parseInt(authorResult.rows[0].id);
      // Insert the new thread
      const result = await client.query(
        'INSERT INTO threads (title, genres, author, created, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, genres, authorId, created, content]
      );
  
      client.release();
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding thread:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  


app.get("/posts", async (req, res) => {
    const threadId = parseInt(req.query.threadId);
  
    if (isNaN(threadId)) {
      return res.status(400).send("Invalid thread ID");
    }
  
    try {
      const client = await pool.connect();
  
      // Query to get posts with author's email and images
      const query = `
      SELECT
        posts.id,
        posts.threadID,
        posts.author,
        posts.created,
        posts.content,
        users.email AS author_email
      FROM
        posts
      LEFT JOIN
        users ON posts.author = users.id
      WHERE
        posts.threadID = $1
      ORDER BY
        posts.created;
    `;
  
      const result = await client.query(query, [threadId]);
      const posts = result.rows;
      client.release();
  
      res.status(200).json(posts);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      res.status(500).send("Server error");
    }
  });

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