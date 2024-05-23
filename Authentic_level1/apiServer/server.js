import express from 'express';
import bodyParser from 'body-parser';
import { error } from 'console';
import { connectToDB, createUsersTable, getUserFromTable, createNewUser } from './qrs.js';


const port = 8081;
const app = express();

app.use(express.static("public"));
//   app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
await createUsersTable();

app.get("/get_user", async (req,res)=>{
    const {email, password} = req.body;
    if (!email) {
        return res.status(400).send('Email is required');
      }
    let apiResp = await getUserFromTable(email);
    if (apiResp.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      res.json(apiResp.rows[0]);

})

app.listen(port, async (err)=>{
    if (err) throw err;
    await connectToDB();
    console.log("API server is running on port: ", port);
})