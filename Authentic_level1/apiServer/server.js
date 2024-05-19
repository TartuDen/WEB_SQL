import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import { error } from 'console';

const port = 8081;
const app = express();
const client = new pg.Pool({
    user: "dverves",
    host: "localhost",
    database: "secret_page",
    password: "123",
    port: 5432
  });
  
  app.use(express.static("public"));
//   app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  async function connectToDB() {
    try {
      await client.connect();
      console.log("Connected to secret_page db.");
    } catch (error) {
      console.error("Error connecting to secret_page db: ", error);
    }
  }


app.listen(port, async (err)=>{
    if (err) throw err;
    await connectToDB();
    console.log("API server is running on port: ", port);
})