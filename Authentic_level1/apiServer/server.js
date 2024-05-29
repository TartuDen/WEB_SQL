import express from 'express';
import bodyParser from 'body-parser';
import { error } from 'console';
import pg from 'pg';


const port = 8081;
const app = express();

app.use(express.static("public"));
//   app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new pg.Pool({
    user: "dverves",
    host: "localhost",
    database: "secret_page",
    password: "123",
    port: 5432
});


async function connectToDB() {
    try {
        await client.connect();
        console.log("Connected to secret_page db.");
    } catch (error) {
        console.error("Error connecting to secret_page db: ", error);
    }
}


async function createUsersTable() {
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


await createUsersTable();


app.post("/reg_user",async(req,res)=>{
    const {user_name, email, password} = req.body;
    if (!user_name){
        return res.status(400).send("User name is required");
    }
    if (!email){
        return res.status(400).send("Email is required");
    }
    if (!password){
        return res.status(400).send("Password is required");
    }
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length != 0) {
          return res.status(404).send('User already exist');
        }
         // Insert the new user
         await client.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)', [user_name, email, password]);
         res.status(201).send('User registered successfully'); // 201 Created status code 
        
    } catch (err) {
        console.error('Failed to register user:', err.message);
        res.status(500).send('Internal Server Error'); // 500 Internal Server Error status code
    }

})

app.post("/get_user", async (req,res)=>{
    const {email, password} = req.body;
    console.log("here.........\n",email,password);
    if (!email) {
        return res.status(400).send('Email is required');
      }
    if (!password){
        return res.status(400).send("Password is required");
    }
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
          return res.status(404).send('User not found');
        }
        if (result.rows[0].password != password){
            return res.status(404).send("Wrong password");
        }
        res.json(result.rows[0]);
      } catch (err) {
        console.error('Error fetching user by email:', err);
        return res.status(404).send('Something went wrong in server side');
    }

      

})

app.listen(port, async (err)=>{
    if (err) throw err;
    await connectToDB();
    console.log("API server is running on port: ", port);
})