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


app.post("/remove_like", async (req, res) => {
  const { userId, threadId, postId, type } = req.body;

  // Validate the incoming request data
  if (!userId || !type || (threadId === null && postId === null)) {
      return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
      const client = await pool.connect();

      // Construct the delete query based on provided fields
      let deleteLikeQuery = `DELETE FROM likes WHERE userId = $1 AND type = $2`;
      let queryParams = [userId, type];

      if (threadId !== null) {
          deleteLikeQuery += ` AND threadId = $3`;
          queryParams.push(threadId);
      }

      if (postId !== null) {
          deleteLikeQuery += ` AND postId = $4`;
          queryParams.push(postId);
      }

      // Execute the delete query
      const result = await client.query(deleteLikeQuery, queryParams);

      // Check if any row was deleted
      if (result.rowCount === 0) {
          throw new Error('No like found to remove');
      }

      // Release the client back to the pool
      client.release();

      // Send a success response
      res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
      console.error('Error removing like:', error);
      // Send an error response
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add_like', async (req, res) => {
  const newLike = req.body;
  // Validate the incoming request data
  if (!newLike.userId || !newLike.type || (newLike.threadId === undefined && newLike.postId === undefined)) {
      return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
      const client = await pool.connect();

      const insertLikeQuery = `
          INSERT INTO likes (userId, threadId, postId, type)
          VALUES ($1, $2, $3, $4)
      `;

      // Execute the query to insert the like
      await client.query(insertLikeQuery, [parseInt(newLike.userId), newLike.threadId, newLike.postId, newLike.type]);

      // Release the client back to the pool
      client.release();

      // Send a success response
      res.status(200).json({ message: 'Like added successfully' });
  } catch (error) {
      console.error('Error adding like:', error);
      // Send an error response
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/get_user_auth', async (req, res) => {
  const { email } = req.body;
  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      const client = await pool.connect();
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      if (result.rows.length === 0) {
          return res.json({ error: 'User not found' });
      }
      const user = result.rows[0];
      res.status(200).json(user);
      client.release();
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/reg_user', async (req, res) => {
  const { user_name, email, ava } = req.body;
  if (!user_name || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
      const client = await pool.connect();
      const query = `
          INSERT INTO users (user_name, email, ava)
          VALUES ($1, $2, $3)
          RETURNING *`;
      const values = [user_name, email, ava];
      const result = await client.query(query, values);

      const newUser = result.rows[0];
      res.status(201).json(newUser);
      client.release();
  } catch (error) {
      console.error('Error registering user:', error);
      if (error.code === '23505') { // Unique constraint violation
          res.status(409).json({ error: 'Email already exists' });
      } else {
          res.status(500).json({ error: 'Internal server error' });
      }
  }
});

app.put('/edit_thread/:id', async (req, res) => {
  const threadId = parseInt(req.params.id);
  const { title, content, genres } = req.body;

  try {
    const client = await pool.connect();

    // Update the thread in the database
    const result = await client.query(`
      UPDATE threads
      SET title = $1, content = $2, genres = $3
      WHERE id = $4
      RETURNING *
    `, [title, content, genres, threadId]);

    client.release();

    if (result.rowCount === 0) {
      return res.status(404).send('Thread not found');
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating thread:', err);
    res.status(500).send('Internal Server Error');
  }
});


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
        'SELECT id FROM users WHERE id = $1',
        [author]
      );
  
      // Check if the author exists
      if (authorResult.rows.length === 0) {
        throw new Error('Author not found');
      }
  
      // const authorId = parseInt(authorResult.rows[0].id);
      // Insert the new thread
      const result = await client.query(
        'INSERT INTO threads (title, genres, author, created, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, genres, author, created, content]
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
      return res.status(400).json({ message: "Invalid thread ID" });
    }
  
    try {
      const client = await pool.connect();
  
      // Query to get posts with author's email
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
  
      // Handle the case when no posts are found
      if (posts.length === 0) {
        return res.status(200).json({ message: "No posts found", posts: [] });
      }
  
      res.status(200).json(posts);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      res.status(500).json({ message: "Error fetching posts" });
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


app.get("/threads", async (req, res) => {
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
