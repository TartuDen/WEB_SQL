import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const port = 8081;
const app = express();
let dataFromDB;
let messageAdd = null;
let messageGetAll = null;
let messageGetCode = null;

const pool = new pg.Pool({
    user: 'dverves',
    host: 'localhost',
    database: 'postgres',
    password: '123',
    port: 5432,
});

async function createFamilyMemberDB(){
    try{
              // Check if the table exists
            const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'family_member'
            );
            `;
            const { rows } = await pool.query(checkTableQuery);

            const tableExists = rows[0].exists;

            if (!tableExists) {
            // Create the table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE family_member (
                id SERIAL PRIMARY KEY,
                member_name VARCHAR(50) NOT NULL,
                tab_color VARCHAR(50) NOT NULL
                );
            `;
            await pool.query(createTableQuery);
            }
    }catch(err){
        console.log(error.message);
    }
}
await createFamilyMemberDB();


async function createVisitedCountriesDB() {
    try {
        // Check if the table exists
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'visited_countries'
            );
        `;
        const { rows } = await pool.query(checkTableQuery);

        const tableExists = rows[0].exists;

        if (!tableExists) {
            // Create the table if it doesn't exist
            const createTableQuery = `
                CREATE TABLE visited_countries (
                    id SERIAL PRIMARY KEY,
                    country_code VARCHAR(2) NOT NULL,
                    family_member_id INT,
                    FOREIGN KEY (family_member_id) REFERENCES family_member(id)
                );
            `;
            await pool.query(createTableQuery);
        }
    } catch (error) {
        console.log(error.message);
    }
}

await createVisitedCountriesDB();


async function getAllData(member_name) {
    try {
        let query;
        let values;
        
        if (member_name === "All Members") {
            query = 'SELECT * FROM visited_countries';
        } else {
            query = 'SELECT vc.country_code, fm.tab_color FROM visited_countries vc JOIN family_member fm ON vc.family_member_id = fm.id WHERE fm.member_name = $1';
            values = [member_name];
        }

        const res = await pool.query(query, values);
        const dataFromDB = res.rows;
        return dataFromDB.map(item => ({ country_code: item.country_code, tab_color: item.tab_color }));
    } catch (err) {
        console.error(err);
        messageGetAll = err;
        // You might want to handle the error here or propagate it further
        // throw err;
    }
}


async function getUsers() {
    try {
        const query = 'SELECT member_name, tab_color FROM family_member';
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error(err);
        // You might want to handle the error here or propagate it further
        // throw err;
    }
}


async function addData(dataToAdd) {
    try {
        // Check if the data already exists in the database
        const existingData = await pool.query('SELECT * FROM visited_countries WHERE country_code = $1', [dataToAdd]);

        if (existingData.rows.length > 0) {
            messageAdd = `Data for country code already exists in the database.`;
            console.log(`Data for country code '${dataToAdd}' already exists in the database.`);
            return; // Exit the function without adding duplicate data
        }

        // Insert the data into the database
        const res = await pool.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [dataToAdd]);
        console.log("Data Successfully added at: " + new Date().toLocaleString());
        messageAdd = "Data Successfully added";
    } catch (err) {
        console.error(err);
        messageAdd = err;;
        // You might want to handle the error here or propagate it further
        // throw err;
    }
}

async function getCodeFromName(name) {
    try {
        const res = await pool.query("SELECT country_code FROM country_codes_table WHERE country_name = $1", [name]);
        if (res.rows.length > 0) {
            return res.rows[0].country_code; // Return the country code from the first row
        } else {
            return null; // Return null if no matching country code found
        }
    } catch (err) {
        console.error("Error executing query:", err);
        messageGetCode = "Error executing query:" + err;
        // // throw err; // Re-throw the error to be handled by the caller
    }
}

async function countryExists(name) {
    try {
        const res = await pool.query("SELECT COUNT(*) FROM country_codes_table WHERE country_name = $1", [name]);
       
        return res.rows[0].count > 0; 
    } catch (err) {
        console.error("Error checking country existence: ", err);
        messageGetCode = "Error checking country existence: " + err;
        // throw err;
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/api/v01/getCodeFromName/:countryName", async (req, res) => {
    let countryName = req.params.countryName;
    // Now you can use the `countryName` variable to access the value passed in the URL

    if (await countryExists(countryName)) {
        try {
            let countryCode = await getCodeFromName(countryName);
            res.status(200).json({countryCode});
        } catch (error) {
            console.error("Error retrieving country code:", error);
            messageGetCode = "Internal server error";
            res.status(500).json({ messageGetCode });
        }
    } else {
        messageGetCode = "Such country does not exist...";
        res.status(200).json({ messageGetCode });
    }
});


app.get("/api/v01", async (req, res) => {
    const member_name = req.query.member_name;
    let countries = await getAllData(member_name);
    console.log("*****countries******");
    console.log(countries);
    res.status(200).json({countries, messageGetAll});
})

app.get("/api/v01/users",async (req,res)=>{
    let users = await getUsers();
    // console.log("users: ",users);
    res.status(200).json(users)
})

app.post("/api/v01/add", async (req, res) => {
    await addData(req.body.data)

    res.status(201).json({messageAdd})
})


// Function to create the table if not exists and add a new member
async function addNewMember(memberName, tabColor) {
    try {
      // Add the new member
      const addMemberQuery = `
        INSERT INTO family_member (member_name, tab_color)
        VALUES ($1, $2)
      `;
      await pool.query(addMemberQuery, [memberName, tabColor]);
  
      console.log(`New member "${memberName}" added with tab color "${tabColor}".`);
    } catch (error) {
      console.error('Error adding new member:', error.message);
    }
  }

app.post("/api/v01/add_new_member", async(req,res)=>{
    const{memberName,tabColor} = req.body;
    console.log(memberName,tabColor);
    await addNewMember(memberName, tabColor);
    res.status(201).json({message: "new member added"})
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log("api server is running on port: " + port);
})