// setupDatabase.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const pool = new Pool({
    user: 'your_username',
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
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE
            );
        `;

        const createThreadsTable = `
            CREATE TABLE IF NOT EXISTS threads (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                genres TEXT[],
                author VARCHAR(100),
                created TIMESTAMP,
                content TEXT
            );
        `;

        const createPostsTable = `
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                threadID INTEGER REFERENCES threads(id),
                author VARCHAR(100),
                created TIMESTAMP,
                content TEXT
            );
        `;

        const createLikesTable = `
            CREATE TABLE IF NOT EXISTS likes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100),
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

createTables().catch(err => console.error("Error setting up database:", err));

export default createTables;
