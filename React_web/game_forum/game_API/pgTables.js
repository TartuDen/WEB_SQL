// setupDatabase.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { users, threads, posts, likes } from './apiMOCKS.js'; // Import your mock data

dotenv.config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'game_forum',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
});


const createTables = async () => {
    const client = await pool.connect();

    try {
        const dropTables = `
            DROP TABLE IF EXISTS likes;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS threads;
            DROP TABLE IF EXISTS users;
        `;

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                user_name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                ava BYTEA
            );
        `;

        const createThreadsTable = `
            CREATE TABLE IF NOT EXISTS threads (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                genres TEXT[],
                author INTEGER REFERENCES users(id),
                created TIMESTAMP,
                content VARCHAR(4000)
            );
        `;

        const createPostsTable = `
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                threadID INTEGER REFERENCES threads(id),
                author INTEGER REFERENCES users(id),
                created TIMESTAMP,
                content VARCHAR(4000)
            );
        `;

        const createLikesTable = `
            CREATE TABLE IF NOT EXISTS likes (
                id SERIAL PRIMARY KEY,
                userId INTEGER REFERENCES users(id),
                threadId INTEGER REFERENCES threads(id),
                postId INTEGER REFERENCES posts(id),
                type VARCHAR(10)
            );
        `;

        // await client.query(dropTables); // Drop existing tables
        await client.query(createUsersTable);
        await client.query(createThreadsTable);
        await client.query(createPostsTable);
        await client.query(createLikesTable);

        console.log("All tables created successfully or already exist.");
    } catch (err) {
        console.error("Error creating tables:", err);
    } finally {
        client.release();
    }
};


const insertData = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Insert users
        for (let user of users) {
            await client.query(`
                INSERT INTO users (user_name, email, ava)
                VALUES ($1, $2, $3)
            `, [user.name, user.email, user.ava]);
        }

        // Insert threads
        for (let thread of threads) {
            await client.query(`
                INSERT INTO threads (title, genres, author, created, content)
                VALUES ($1, $2, $3, $4, $5)
            `, [thread.title, thread.genres, thread.author, thread.created, thread.content]);
        }

        // Insert posts
        for (let post of posts) {
            await client.query(`
                INSERT INTO posts (threadID, author, created, content)
                VALUES ($1, $2, $3, $4)
            `, [post.threadID, post.author, post.created, post.content]);
        }

        // Insert likes
        for (let like of likes) {
            await client.query(`
                INSERT INTO likes (userId, threadId, postId, type)
                VALUES ($1, $2, $3, $4)
            `, [like.userId, like.threadId, like.postId, like.type]);
        }

        await client.query('COMMIT');
        console.log("All data inserted successfully.");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error inserting data:", err);
    } finally {
        client.release();
    }
};

const setupDatabase = async () => {
    await createTables();
    // await insertData();
};

setupDatabase().then(() => {
    console.log("Database setup complete with data inserted.");
}).catch(err => {
    console.error("Error setting up database:", err);
});

export { createTables, insertData, pool };
