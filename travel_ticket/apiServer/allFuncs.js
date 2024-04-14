
export const Querys = {
    familyDB : async function createFamilyMemberDB(){
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
            console.log(err);
        }
    }
}