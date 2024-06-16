import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./css/App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import EquipmentTable from "../src/firstPage/table";
import { CssBaseline, Container, Box } from "@mui/material";
import InputProjTpVers from './firstPage/inputForProject';

const ServerAPIUrl = "http://3.72.208.221:8090"
const LocalAPIUrl="http://localhost:8085"
function App() {
  const [backEndData, setBackEndData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/main_table");
        const data = await response.json();
        setBackEndData(data);
      } catch (error) {
        console.error(
          'Error fetching data from fetch("/api/main_table"):',
          error
        );
      }
    };

    fetchData();
  }, []);

  const [savedProjects, updateSavedProjects] = useState([{
    project: [{
      tp: [{
        version: []
      }]
    }]
  }]);

  useEffect(() => {
    const fetchProjData = async () => {
      try {
        const response = await fetch(`${ServerAPIUrl}/processdata/projects`);
        const projects = await response.json();

        const projectsWithDetails = await Promise.all(projects.map(async (project) => {
          const tpResponse = await fetch(`${ServerAPIUrl}/processdata/projects/${project.length>0&&project}/tp`);
          const tps = await tpResponse.json();

          const tpsWithVersions = await Promise.all(tps.map(async (tp) => {
            const versionResponse = await fetch(`${ServerAPIUrl}/processdata/projects/${project.length>0&&project}/tp/${tp}/versions`);
            const versions = await versionResponse.json();
            return { tp, versions };
          }));

          return { project, tps: tpsWithVersions };
        }));
        console.log("projectsWithDetails: ", projectsWithDetails); // Log the projectsWithDetails object
        updateSavedProjects(projectsWithDetails);
      } catch (error) {
        console.log('Error fetching project data:', error);
      }
    };

    fetchProjData();
  }, []);
  
  if (!backEndData.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <CssBaseline />
      <Header />
      <Container component="main" sx={{ flex: 1 }}>
        {/* Main content goes here */}
        <Box mb={4} mt={6}>
          <InputProjTpVers
          savedProjects={savedProjects} />
        </Box>
        <EquipmentTable data={backEndData} />
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
