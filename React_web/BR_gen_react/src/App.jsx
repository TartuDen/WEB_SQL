import { useEffect, useState } from "react";
import { CssBaseline, Container, Box } from "@mui/material";
import viteLogo from "/vite.svg";
import "./css/App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import EquipmentTable from "../src/firstPage/table";
import { InputProj, InputTp, InputVersion } from "./firstPage/inputForProject";

const ServerAPIUrl = "http://3.72.208.221:8090";
const LocalAPIUrl = "http://localhost:8085";

function App() {
  const [backEndDataMap, setBackEndDataMap] = useState([]);
  const [backendDataProj, setBackendDataProj] = useState([]);
  const [backendDataTp, setBackendDataTp] = useState([]);
  const [backendDataVersion, setBackendDataVersion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/main_table");
        const data = await response.json();
        setBackEndDataMap(data.equipmentMap);
        setBackendDataProj(data.projTpVers);
      } catch (error) {
        console.error(
          'Error fetching data from fetch("/api/main_table"):',
          error
        );
      }
    };

    fetchData();
  }, []);

  function funcCheckChoiceProj(value) {
    const proj = backendDataProj.find((elem) => elem.project === value);
    if (proj) {
      setBackendDataTp(proj.tps);
      setBackendDataVersion([]); // Reset versions when project changes
    }
  }

  function funcCheckChoiceTp(value) {
    const tp = backendDataTp.find((elem) => elem.tp === value);
    if (tp) {
      setBackendDataVersion(tp.versions);
    }
  }

  function funcCheckChoiceVersion(value) {
    const version = backendDataVersion.find((elem) => elem.version === value);
    if (version) {
      setBackendDataVersion([version]);
    }
  }

  if (!backEndDataMap.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <CssBaseline />
      <Header />
      <Container component="main" sx={{ flex: 1 }}>
        {/* Main content goes here */}
        <Box mb={1} mt={6}>
          <InputProj
            select={backendDataProj}
            funcCheckChoiceProj={funcCheckChoiceProj}
          />
        </Box>
        <Box mb={1}>
          <InputTp
            select={backendDataTp}
            funcCheckChoiceTp={funcCheckChoiceTp}
          />
        </Box>
        <Box mb={1}>
          <InputVersion
            select={backendDataVersion}
            funcCheckChoiceVersion={funcCheckChoiceVersion}
          />
        </Box>
        <EquipmentTable data={backEndDataMap} />
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
