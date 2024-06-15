import axios from "axios";
import { EquipmentNoOperation, EquipmentInfo, Operation } from "./dataClasses.js";


// Function to handle errors uniformly
function handleError(error, message) {
    console.error(`Error: ${message}`, error.response ? error.response.data : error.message);
    return null;
}

/**
 * Fetches process operations data from the server based on the provided project name, TP, and version.
 * 
 * @param {string} projectName - The name of the project.
 * @param {string} tp - The TP (Technical Plan) identifier.
 * @param {string} version - The version of BR.
 * @returns {Array} An array of process operations data if successful, or an empty array if an error occurs.
 */
export async function getProcOps(projectName, tp, version){
    try{
        let apiResp = await axios.get(`http://3.72.208.221:8090/processoperation/${projectName}/${tp}/${version}`);
        return apiResp.data;
    }catch(error){
        handleError(error, "Error getting data from getProcOps:");
        return []
    }
}

/**
 * Sends a POST request to add a new operation to the server.
 * 
 * @param {Object} newOp - The new operation data to be added.
 * @returns {Object} The response data from the server if successful, or an empty array if an error occurs.
 */
export async function postNewOp(newOp){
    try{
        let apiResp = await axios.post(`http://3.72.208.221:8090/processoperation`, newOp);
        return apiResp.data;
    }catch(error){
        handleError(error, "Error getting data from postNewOp:");
        return []
    }
}

/**
 * Fetches main table equipment data from the server.
 * 
 * @returns {Array|null} An array of EquipmentNoOperation objects if successful, or null if an error occurs.
 */
export async function getMainTableEq() {
    try {
        let apiResp = await axios.get("http://3.72.208.221:8090/main_table_equipment");
        
        if (apiResp.data && Array.isArray(apiResp.data)) {
            let newObj = apiResp.data.map(item => new EquipmentNoOperation(item.name, item.equipmentInfo));
            // console.log(newObj);
            return newObj;
        } else {
            console.error("Invalid API response format");
            return null;
        }
    } catch (error) {
        return handleError(error, "Error getting data from getMainTableEq:");
    }
}

/**
 * Fetches project data from the server based on the provided project name.
 * 
 * @param {string} projectName - The name of the project to fetch data for.
 * @returns {Object|Array} The project data if successful, or an empty array if an error occurs.
 */
export async function getProjectName(projectName){
    try{
        let apiResp = await axios.post(`http://3.72.208.221:8090/processoperation`, projectName);
        return apiResp.data;
    }catch(error){
        handleError(error, "Error getting data from getProjectName:");
        return []
    }
}

/**
 * Fetches all project data from the server.
 * 
 * @returns {Array} An array of project data if successful, or an empty array if an error occurs.
 */
export async function getAllProjects(){
    try{
        let apiResp = await axios.get(`http://3.72.208.221:8090/processdata/projects`);
        return apiResp.data;
    }catch(error){
        handleError(error, "Error getting data from getAllProjects:");
        return []
    }
}

/**
 * Fetches all TP (Technological Process) data for a specific project from the server.
 * 
 * @param {string} projectName - The name of the project to fetch TP data for.
 * @returns {Array} An array of TP data if successful, or an empty array if an error occurs.
 */
export async function getAllTp(projectName){
    try{
        let apiResp = await axios.get(`http://3.72.208.221:8090/processdata/projects/${projectName}/tp`);
        return apiResp.data;
    }catch(error){
        handleError(error, "Error getting data from getAllTp:");
        return []
    }
}

/**
 * Fetches all versions of a specific TP (Technical Plan) for a project from the server.
 * 
 * @param {string} projectName - The name of the project.
 * @param {string} tp - The TP (Technical Plan) identifier.
 * @returns {Array} An array of version data if successful, or an empty array if an error occurs.
 */
export async function getAllVersions(projectName, tp){
    try{
        let apiResp = await axios.get(`http://3.72.208.221:8090/processdata/projects/${projectName}/tp/${tp}/versions`);
        return apiResp.data;
    }catch(error){
        handleError(error, "Error getting data from getAllVersions:");
        return []
    }
}

/**
 * Fetches equipment data by name from the server.
 * 
 * @param {string} name - The name of the equipment to fetch.
 * @returns {EquipmentNoOperation|null} An EquipmentNoOperation object if successful, or null if an error occurs.
 */
export async function getEqByName(name) {
    try {
        let apiResp = await axios.get("http://3.72.208.221:8090/equipment/"+name);

        
        if (apiResp.data ) {
            // Convert equipmentInfo array to instances of EquipmentInfo
            const equipmentInfo = apiResp.data.equipmentInfo.map(info => new EquipmentInfo(info.code, info.description));

            // Convert operations array to instances of Operation
            const operations = apiResp.data.operations.map(op => new Operation(op.operationType, op.content, op.other));

            // Create an instance of EquipmentNoOperation
            const equipment = new EquipmentNoOperation(apiResp.data.name, equipmentInfo, operations);

            // Now, you can use 'equipment' object as needed
            console.log("equipment: ", equipment);
            return equipment;
        } else {
            console.error("Invalid API response format");
            return null;
        }
    } catch (error) {
        handleError(error, "Error getting data from getEqByName:");
        return null;
    }
}

/**
 * Fetches activity type data from the server.
 * 
 * @returns {Object|null} The activity type data if successful, or null if an error occurs.
 */
export async function getActivityTypeFromAPI() {
    try {
        let apiResp = await axios.get("http://3.72.208.221:8090/activity_type");
        return apiResp.data;
    } catch (error) {
        handleError(error, "Error getting data from getActivityTypeFromAPI:");
        return null;
    }
}

/**
 * Fetches utensil data from the server.
 * 
 * @returns {Array|null} An array of utensil data if successful, or null if an error occurs.
 */
export async function getUtensils() {
    try {
        let apiResp = await axios.get("http://localhost:8081/utensils");
        return apiResp.data;
    } catch (error) {
        return handleError(error, "Error getting data from getUtensils:");
    }
}

/**
 * Fetches parameter data from the server.
 * 
 * @returns {Array|null} An array of parameter data if successful, or null if an error occurs.
 */
export async function getParams() {
    try {
        let apiResp = await axios.get("http://3.72.208.221:8090/parameters");
        return apiResp.data;
    } catch (error) {
        return handleError(error, "Error getting data from getParams:");

    }
}

/**
 * Sends a POST request to add new equipment data to the server.
 * 
 * @param {Object} newEq - The new equipment data to be added.
 * @returns {Object|null} The response data from the server if successful, or null if an error occurs.
 */
export async function postEq(newEq){
    try {
        console.log("..........newEq.............\n",newEq);
        const apiResp = await axios.post("http://3.72.208.221:8090/equipment", newEq);
        return apiResp.data; // Return the response data if needed
    } catch (error) {
        return handleError(error, "Error getting data from postEq:");
    }
}

/**
 * Sends a DELETE request to remove equipment data from the server.
 * 
 * @param {string} name - The name of the equipment to be deleted.
 * @returns {Object|null} The response data from the server if successful, or null if an error occurs.
 */
export async function deleteEq(name){
    try{
        const apiResp = await axios.delete("http://3.72.208.221:8090/equipment/"+name);
        return apiResp.data
    }catch(error){
        return handleError(error, "Error getting data from getProcOps:");
        
    }
}

/**
 * Fetches process initialization info from the server based on the provided project name, TP, and version.
 * 
 * @param {string} projectName - The name of the project.
 * @param {string} tp - The TP (Technological Process) identifier.
 * @param {string} version - The version of BR.
 * @returns {Object|null} The process initialization info if successful, or null if an error occurs.
 */
export async function getProcessInitInfo(projectName, tp, version){
        if (projectName && tp && version){
                try{
            const apiResp = await axios.get(`http://3.72.208.221:8090/processInitialInfo/${projectName}/${tp}/${version}`);
            return apiResp.data
            }catch(error){
                return handleError(error, "Error getting data from getProcOps:");
                
            }
        }else{
            console.log("Wrong type of data",projectName,tp,version)
        }
    }

export async function deleteProcessInitialInfo(projectName, tp, version){
    try{
        const apiResp = await axios.delete(`http://3.72.208.221:8090/processInitialInfo/${projectName}/${tp}/${version}`);
        return apiResp.data
    }catch(error){
        return handleError(error, "Error getting data from deleteProcessInitialInfo:");
    }
}

export async function postProcessInitialInfo(localMemory){
    try{
        const apiResp = await axios.post(`http://3.72.208.221:8090/processInitialInfo`, localMemory);
        return apiResp.data
    }catch(error){
        return handleError(error, "Error getting data from postProcessInitialInfo:");
    }
}


export async function deleteBr(projectName,tp,version){
    try{
        const apiResp = await axios.delete(`http://3.72.208.221:8090/processoperation/${projectName}/${tp}/${version}`);
        return apiResp.data;
    }catch(error){
        return handleError(error, "Error deleting data from deleteBr");
    }
}

export async function deleteBRfromLocalMemory(projectName,tp,version){
    try{
        const apiResp = await axios.delete(`http://3.72.208.221:8090/processInitialInfo/${projectName}/${tp}/${version}`);
        return apiResp.data;
    }catch(error){
        return handleError(error, "Error deleting data from deleteBRfromLocalMemory");
    }
}

export async function deleteOpFromBR(projectName, tp, version, opNumber){
    try{
        const apiResp = await axios.delete(`http://3.72.208.221:8090/processoperation/${projectName}/${tp}/${opNumber}/${version}`);
        return apiResp.data;
    }catch(error){
        return handleError(error, "Error deleting data from deleteOpFromBR");
    }
}

export async function updateOpFromBR(projectName, tp, version){
    try{
        const apiResp = await axios.patch(`http://3.72.208.221:8090/processdata/${projectName}/${tp}/${version}`);
        
        return apiResp.data;
    }catch(error){
        return handleError(error, "Error getting data from updateOpFromBR");
    }
}