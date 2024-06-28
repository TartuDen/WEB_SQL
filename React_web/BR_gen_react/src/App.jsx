import { useEffect, useState } from "react";
import { CssBaseline, Container, Box } from "@mui/material";
import "./css/App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { EquipmentTable, MatTable } from "./firstPage/mainTables";
import { InputProj, InputTp, InputVersion } from "./firstPage/inputForProject";

const ServerAPIUrl = "http://3.72.208.221:8090";
const LocalAPIUrl = "http://localhost:8085";

function App() {
  const [backEndDataMap, setBackEndDataMap] = useState([]);
  const [backEndDataProj, setBackEndDataProj] = useState([]);
  const [backEndDataMemory, setBackEndDataMemory] = useState([]);
  const [backEndDataTp, setBackEndDataTp] = useState([]);
  const [backEndDataVersion, setBackEndDataVersion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/main_table");
        const data = await response.json();
        setBackEndDataMap(data.equipmentMap);
        setBackEndDataProj(data.projTpVers);
        setBackEndDataMemory(data.memory);
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
    const proj = backEndDataProj.find((elem) => elem.project === value);
    if (proj) {
      setBackEndDataTp(proj.tps);
      setBackEndDataVersion([]); // Reset versions when project changes
    }
  }

  function funcCheckChoiceTp(value) {
    const tp = backEndDataTp.find((elem) => elem.tp === value);
    if (tp) {
      setBackEndDataVersion(tp.versions);
    }
  }

  function funcCheckChoiceVersion(value) {
    const version = backEndDataVersion.find((elem) => elem.version === value);
    if (version) {
      setBackEndDataVersion([version]);
    }
    console.log("...changed.....");
  }

  if (!backEndDataMap.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <CssBaseline />
      <Header />
      <Container
        component="main"
        sx={{ flex: 1, width: "90vw", maxWidth: "none" }}
      >
        {/* Main content goes here */}
        <Box mb={1} mt={6}>
          <InputProj
            select={backEndDataProj}
            funcCheckChoiceProj={funcCheckChoiceProj}
          />
        </Box>
        <Box mb={1}>
          <InputTp
            select={backEndDataTp}
            funcCheckChoiceTp={funcCheckChoiceTp}
          />
        </Box>
        <Box mb={1}>
          <InputVersion
            select={backEndDataVersion}
            funcCheckChoiceVersion={funcCheckChoiceVersion}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box flex={1} mr={1}>
            <EquipmentTable data={backEndDataMap}  />
          </Box>
          <Box flex={1} ml={1}>
            <MatTable />
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
