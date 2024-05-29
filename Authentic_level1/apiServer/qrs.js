import pg from "pg";

export const client = new pg.Pool({
    user: "dverves",
    host: "localhost",
    database: "secret_page",
    password: "123",
    port: 5432
});


export async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to secret_page db.");
    } catch (error) {
        console.error("Error connecting to secret_page db: ", error);
    }
}


export async function createUsersTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      );
    `;
  
    try {
      await client.query(query);
      console.log("Table 'users' is ready.");
    } catch (error) {
      console.error("Error creating 'users' table: ", error);
    }
  }

export async function getUserFromTable(email, password){
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          return res.status(404).send('User not found');
        }
        if (result.rows.password != password){
            return res.status(404).send("Wrong password");
        }

        res.json(result.rows[0]);
      } catch (err) {
        console.error('Error fetching user by email:', err);
      }
}

export async function createNewUser(user_name, email, password){
    try {
        const result = await client.query(
          'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *',
          [user_name, email, password]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error inserting new user:', error);
        if (error.code === '23505') {
          // Unique violation error code
          res.status(409).send('Email already exists');
        } else {
          res.status(500).send('Internal Server Error');
        }
      }
}