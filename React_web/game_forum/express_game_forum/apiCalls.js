import {createTables, pool} from './pgTables.js'


async function getAllThreads(){
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

        return threads;
    } catch (err) {
        console.error("error", err.message);
        res.status(500).send("Server error");
    }
}

async function getThreadById(threadId){

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

        return thread;
    } catch (err) {
        console.error("error", err.message);
        res.status(500).send("Server error");
    }
}

async function getPostsByThreadId(threadId){
  
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
  
      return posts;
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      res.status(500).json({ message: "Error fetching posts" });
    }
}

async function addThreadToDB(title, genres, author, created, content){
    try {    
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
    
        return result.rows[0];
      } catch (err) {
        console.error('Error adding thread:', err.message);
        res.status(500).send('Server error');
      }
}

export {getAllThreads, getThreadById, getPostsByThreadId, addThreadToDB}