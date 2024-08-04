import { createTables, pool } from "./pgTables.js";

async function getAllThreads() {
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

async function getThreadById(threadId) {
  try {
    const client = await pool.connect();

    // Query to get the specific thread by ID with author email and associated likes
    const result = await client.query(
      `
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
        `,
      [threadId]
    );

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

async function getPostsByThreadId(threadId) {
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

    return posts;
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

async function addThreadToDB(newThread) {
  try {
    const { title, genres, author, created, content } = newThread;
    const client = await pool.connect();

    // First, get the author ID from the email
    const authorResult = await client.query(
      "SELECT id FROM users WHERE id = $1",
      [author]
    );

    // Check if the author exists
    if (authorResult.rows.length === 0) {
      throw new Error("Author not found");
    }

    // const authorId = parseInt(authorResult.rows[0].id);
    // Insert the new thread
    const result = await client.query(
      "INSERT INTO threads (title, genres, author, created, content) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, genres, author, created, content]
    );

    client.release();

    return result.rows[0];
  } catch (err) {
    console.error("Error adding thread:", err.message);
    res.status(500).send("Server error");
  }
}

async function getUserAuthFromDB(email) {
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const client = await pool.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);
    if (result.rows.length === 0) {
      return res.json({ error: "User not found" });
    }
    const user = result.rows[0];
    client.release();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addPost(newPost) {
  try {
    const client = await pool.connect();
    const { threadId, authorId, content, created } = newPost;

    const insertPostQuery = `
      INSERT INTO posts (threadID, author, created, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [parseInt(threadId), parseInt(authorId), created, content];
    const result = await client.query(insertPostQuery, values);

    return result.rows[0];
  } catch (err) {
    res.json({ message: err });
  }
}

async function deleteThread(threadId) {
  try {
    // Start a transaction
    const client = await pool.connect();
    await client.query("BEGIN");

    // Delete the likes associated with the thread
    await client.query("DELETE FROM likes WHERE threadId = $1", [threadId]);

    // Delete the posts associated with the thread
    await client.query("DELETE FROM posts WHERE threadID = $1", [threadId]);

    // Delete the thread itself
    const result = await client.query(
      "DELETE FROM threads WHERE id = $1 RETURNING *",
      [threadId]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).send("Thread not found");
    }

    // Commit the transaction
    await client.query("COMMIT");
  } catch (err) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting thread:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function editThreadById(id, updatedThread) {
  const threadId = parseInt(id);
  const { title, content, genres } = updatedThread;

  try {
    const client = await pool.connect();

    // Update the thread in the database
    const result = await client.query(
      `
      UPDATE threads
      SET title = $1, content = $2, genres = $3
      WHERE id = $4
      RETURNING *
    `,
      [title, content, genres, threadId]
    );

    client.release();

    if (result.rowCount === 0) {
      return res.status(404).send("Thread not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating thread:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function editPost(postId, content) {
  try {
    // Update the post content in the database
    const updateQuery = `
      UPDATE posts 
      SET content = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [content, postId]);

    // Check if the post was updated
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Respond with the updated post
    return { message: "Post updated successfully.", post: result.rows[0] };
  } catch (err) {
    res.json({ message: err });
  }
}

async function deletePost(postId) {
  try {
    // Delete the post from the database
    const deleteQuery = `
      DELETE FROM posts 
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(deleteQuery, [postId]);

    // Check if the post was deleted
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Respond with a success message
    return { message: "Post deleted successfully." };
  } catch (err) {
    res.json({ message: err });
  }
}

async function addLIke(newLike) {
  // Validate the incoming request data
  if (
    !newLike.userId ||
    !newLike.type ||
    (newLike.threadId === undefined && newLike.postId === undefined)
  ) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const client = await pool.connect();

    const insertLikeQuery = `
        INSERT INTO likes (userId, threadId, postId, type)
        VALUES ($1, $2, $3, $4)
    `;

    // Execute the query to insert the like
    await client.query(insertLikeQuery, [
      parseInt(newLike.userId),
      newLike.threadId,
      newLike.postId,
      newLike.type,
    ]);

    // Release the client back to the pool
    client.release();

    // Send a success response
    return { message: "Like added successfully" };
  } catch (error) {
    console.error("Error adding like:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}

async function removeLike(existingLike) {
  const { userId, threadId, postId, type } = existingLike;

  // Validate the incoming request data
  if (!userId || !type || (threadId === null && postId === null)) {
    return res.status(400).json({ error: "Invalid request data" });
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
      throw new Error("No like found to remove");
    }

    // Release the client back to the pool
    client.release();

    // Send a success response
    return { message: "Like removed successfully" };
  } catch (error) {
    console.error("Error removing like:", error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUser(email) {
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const client = await pool.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);
    if (result.rows.length === 0) {
      return res.json({ error: "User not found" });
    }
    const user = result.rows[0];
    client.release();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function regUser(user) {
  const { user_name, email, ava } = user;
  if (!user_name || !email) {
    return res.status(400).json({ error: "Username and email are required" });
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
    console.error("Error registering user:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export {
  regUser,
  getUser,
  removeLike,
  addLIke,
  deletePost,
  editPost,
  editThreadById,
  deleteThread,
  addPost,
  getAllThreads,
  getThreadById,
  getPostsByThreadId,
  addThreadToDB,
  getUserAuthFromDB,
};
