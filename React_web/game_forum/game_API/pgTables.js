// setupDatabase.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

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

// createTables().catch(err => console.error("Error setting up database:", err));

export {createTables, pool};
