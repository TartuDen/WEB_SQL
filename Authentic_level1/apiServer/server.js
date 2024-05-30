import express from 'express';
import bodyParser from 'body-parser';
import { error } from 'console';
import pg from 'pg';
import bcrypt from 'bcrypt';
import env from 'dotenv';


const port = 8081;
const app = express();

app.use(express.static("public"));
//   app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
env.config();

const saltRounds = 10 + new Date().getFullYear() / 2024;


const client = new pg.Pool({
	user: process.env.PG_DB_USER,
	host: process.env.PG_DB_HOST,
	database: process.env.PG_DB_DATABASE,
	password: process.env.PG_DB_PASSWORD,
	port: process.env.PG_DB_PORT
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


app.post("/reg_user", async (req, res) => {
	const { user_name, email, password } = req.body;
	if (!user_name) {
		return res.json({message: "User name is required"});
	}
	if (!email) {
		return res.json({message: "Email is required"});
	}
	if (!password) {
		return res.json({message: "Password is required"});
	}
	try {
		const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
		if (result.rows.length != 0) {
			return res.json({message: "user already exist"});
		}
		//password hashing
		bcrypt.hash(password, saltRounds, async (err, hash) => {
			if (err) {
				console.log("Error during hashing the password: ", err.message);
			} else {
				// Insert the new user
				const result = await client.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *', [user_name, email, hash]);
				res.json(result.rows[0]); // 201 Created status code 
			}

		})


	} catch (err) {
		console.error('Failed to register user:', err.message);
		res.status(500).send('Internal Server Error'); // 500 Internal Server Error status code
	}

})

app.post("/get_user", async (req, res) => {
	const { email, password } = req.body;
	if (!email) {
		return res.json({message: 'Email is required'});
	}
	if (!password) {
		return res.json({message: "Password is required"});
	}
	try {
		const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
		const storedHashedPassword = result.rows[0].password;
		if (result.rows.length === 0) {
			return res.json({message: 'User not found'});
		}
		bcrypt.compare(password,storedHashedPassword,(err, hashResult)=>{
			if(err){
				return res.json({message: "Wrong password"});
			}else if (hashResult){
				res.json(result.rows[0]);
			}
		})
	} catch (err) {
		console.error('Error fetching user by email:', err);
		return res.json({message: 'Something went wrong in server side'});
	}



})

app.listen(port, async (err) => {
	if (err) throw err;
	await connectToDB();
	console.log("API server is running on port: ", port);
})