import { Reagent } from "./dataClasses.js";
import { LocalMemory } from "./dataClasses.js";
import { TypicalActivity, ProcessOperation, Material, Equipment} from "./operationClasses.js";



export function selectOps(operationsMap, localMemory) {
    let selectedOperationMap = [];

    for (let operation of operationsMap) {

        for (let eqSet of localMemory.equipmentSet) {
            let code = eqSet.code;
            let eq = eqSet.name;
            let idIndex = eq.indexOf("id");
            if (idIndex !== -1) { // Check if "id" exists in the string
                eq = eq.slice(0, idIndex); // Slice the string from the beginning to the index of "id"
            }
            if (operation.name === eq && code !== "") {
                selectedOperationMap.push(operation);
                break;
            }
        }
    }
    return selectedOperationMap;
}
export function convertToMemoryObj(inputObject) {
    let equipmentSet = [];
    let reagentSet = [];

    // Iterate over the inputObject properties
    for (let key in inputObject) {
        if (inputObject.hasOwnProperty(key) && inputObject[key] !== '') {
            // Check if the property represents equipment
            if (key.startsWith('balances') || key.startsWith('reactor') || key.startsWith('d_filter') || key.startsWith('n_filter') || key.startsWith('m_pump') || key.startsWith('p_pump') || key.startsWith('o_pump') || key.startsWith('vac_oven') || key.startsWith('conv_oven')) {
                equipmentSet.push({
                    name: key,
                    code: inputObject[key]
                });
            } 
            // Check if the property represents a reagent
            else if (key.startsWith('reagent')) {
                // Extract the reagent index from the key
                const reagIndex = key.slice(7);
                // Construct the reagent object and push it to the reagents array
                reagentSet.push(new Reagent(key, inputObject[key], inputObject['mass' + reagIndex]));
            }
        }
    }

    return new LocalMemory({projectName: inputObject.projectName, tp: inputObject.tp, version: inputObject.version, equipmentSet, reagentSet});
}

// Function to get content and other for equipment type and activity type
export function getContentAndOtherForEquipmentAndActivityType(operationsMap, equipmentType, activityType) {
    // Find the equipment object
    const equipmentObj = operationsMap.find(op => op.name === equipmentType);
    if (equipmentObj) {
        // Find the description object for the given activity type
        const descriptionObj = equipmentObj.operations.find(desc => desc.operationType === activityType);
        if (descriptionObj) {
            // Return an object containing both content and other properties
            return {
                content: descriptionObj.content,
                other: descriptionObj.other
            };
        } else {
            return { error: "Content not found for activity type" };
        }
    } else {
        return { error: "Equipment not found" };
    }
}


export function populateContent(content, localMemory) {
    const { equipmentSet } = localMemory;
    const equipmentMap = new Map();

    // Populate equipmentMap with equipment names as keys and array of codes as values
    equipmentSet.forEach(item => {
        const { name, code } = item;
        // const nameWithoutIndex = name.slice(0, -3); // Remove last 3 characters
        let nameWithoutIndex;
        let idIndex = name.indexOf("id");
        if (idIndex !== -1) { // Check if "id" exists in the string
            nameWithoutIndex = name.slice(0, idIndex); // Slice the string from the beginning to the index of "id"
        }

        if (!equipmentMap.has(nameWithoutIndex)) {
            equipmentMap.set(nameWithoutIndex, []);
        }
        equipmentMap.get(nameWithoutIndex).push(code);
    });

    // Regular expression to match placeholders inside curly braces {}
    const placeholderRegex = /{([^{}]*)}/g;

    // Replace placeholders in the content
    const populatedContent = content.replace(placeholderRegex, (match, p1) => {
        // Check if the placeholder matches an equipment name in localMemory
        if (equipmentMap.has(p1)) {
            // If there's a matching equipment name, create a select element with options
            const options = equipmentMap.get(p1).map(code => `<option value="${code}">${code}</option>`).join('');
            return `<select name="${p1}">${options}</select>`;
        } else {
            // If there's no matching equipment name, keep the placeholder unchanged
            return match;
        }
    });

    return populatedContent;
}
export function populateUts(content, utensils, localMemory) {
    const { project, TP } = localMemory;

    // Create a map of utensil names and their corresponding values
    const utensilMap = new Map(utensils.map(item => [item.name, { project, TP }]));

    // Regular expression to match placeholders inside curly braces {}
    const placeholderRegex = /{([^{}]*)}/g;

    // Replace placeholders in the content
    const populatedContent = content.replace(placeholderRegex, (match, p1) => {
        // Check if the placeholder matches a utensil name
        if (utensilMap.has(p1)) {
            // If there's a matching utensil name, replace the placeholder with project or TP
            const { project, TP } = utensilMap.get(p1);
            return project !== '' ? project + " " + TP : TP;
        } else {
            // If there's no matching utensil name, keep the placeholder unchanged
            return match;
        }
    });
    return populatedContent;
}

export function populateMaterials(content, localMemory) {
    const { reagentSet } = localMemory;
    const reagentsMap = new Map(reagentSet.map(reagent => [reagent.tableID, { name: reagent.name, mass: reagent.mass }]));

    // Regular expression to match placeholders inside curly braces containing the word "material"
    const placeholderRegex = /{(\bmaterial\b)}/g;

    // Replace placeholders in the content
    const populatedContent = content.replace(placeholderRegex, () => {
        // Create the select element options using the reagentsMap
        const options = Array.from(reagentsMap.values()).map(reagent => `<option value="${reagent.name}">${reagent.name} - ${reagent.mass}</option>`).join('');

        // Construct the select element with the provided id and name, including a default "select" option
        return `<select name="material"><option value="">--select--</option>${options}</select>`;
    });

    return populatedContent;
}
export function populateParams(content, params) {
    // Regular expression to match placeholders inside curly braces
    const regex = /\{([^{}]+)\}/g;

    // Array to store unique parameter names found in the content
    const uniqueParams = new Set();

    // Match placeholders inside curly braces and extract parameter names
    let match;
    while ((match = regex.exec(content)) !== null) {
        const paramName = match[1];
        uniqueParams.add(paramName);
    }

    // Replace placeholders with HTML input elements
    let replacedContent = content;
    uniqueParams.forEach(paramName => {
        // Check if the parameter is present in the params array
        const paramInfo = params.find(param => param.name === paramName);
        if (paramInfo) {
            // Generate an HTML input element for the parameter
            const inputElement = `<input type="text" name="${paramName}" id="${paramName}" placeholder="${paramName}">`;
            // Replace the placeholder with the HTML input element
            replacedContent = replacedContent.replace(new RegExp(`{${paramName}}`, 'g'), inputElement);
        }
    });

    // Return the content with placeholders replaced by HTML input elements
    return replacedContent;
}

function createEquipment(data) {
    const processEquipments = [];

    if (data.reactor) {
        processEquipments.push(new Equipment("reactor",data.reactor,  /* add other parameters if available */));
    }
    if (data.conv_oven) {
        processEquipments.push(new Equipment("conv_oven",data.conv_oven,  /* add other parameters if available */));
    }
    if (data.balances) {
        processEquipments.push(new Equipment("balances",data.balances,  /* add other parameters if available */));
    }
    if (data.d_filter) {
        processEquipments.push(new Equipment("d_filter",data.d_filter,  /* add other parameters if available */));
    }
    if (data.n_filter) {
        processEquipments.push(new Equipment("n_filter",data.n_filter,  /* add other parameters if available */));
    }
    if (data.m_pump) {
        processEquipments.push(new Equipment("m_pump",data.m_pump,  /* add other parameters if available */));
    }
    if (data.o_pump) {
        processEquipments.push(new Equipment("o_pump",data.o_pump,  /* add other parameters if available */));
    }
    if (data.p_pump) {
        processEquipments.push(new Equipment("p_pump",data.p_pump,  /* add other parameters if available */));
    }

    return processEquipments;
}

// Factory method to create TypicalActivity object
function createTypicalActivity(data) {
    const {
        activityType, content, other, durationMin, durationMax, targetTempMin, targetTempMax, initialTempSet, finalTempSet, processTemp, rpmMin, rpmMax, flowMin, flowMax, ppumpSetMin, ppumpSetMax, vpumpTorrProcess, vpumpTorrMin, vpumpTorrMax
    } = data;

    const processEquipments = createEquipment(data);

    return new TypicalActivity(
        activityType,
        content,
        other,
        durationMin,
        durationMax,
        targetTempMin,
        targetTempMax,
        initialTempSet,
        finalTempSet,
        processTemp,
        rpmMin,
        rpmMax,
        flowMin,
        flowMax,
        ppumpSetMin,
        ppumpSetMax,
        vpumpTorrProcess,
        vpumpTorrMin,
        vpumpTorrMax,
        processEquipments
    );
}

function createMaterialIn(data) {
    const { material } = data;

    return new Material(
        material,
        //add more properties from class Material, once you have them.
        // You can pass default values or empty strings for the rest of the parameters
    );
}

function createMainEquipment(data){
    return {
        name: data.mainEquipment,
        code: data[`${data.mainEquipment}`]
    }
}

// Factory method to create Operation object
export function createProcessOperation(data) {
    const {
        projectName, tp, version, opNumber,  materialOut, wastes
    } = data;
    const mainEquipment = createMainEquipment(data)
    const typAct = createTypicalActivity(data);
    const materialIN = createMaterialIn(data);
    return new ProcessOperation(
        projectName,
        tp,
        version,
        opNumber,
        mainEquipment,
        typAct,
        materialIN,
        materialOut,
        wastes
    );
}
export function parseOperationsData(operations) {
    const uniqueCombinations = {}; // Object to store unique combinations and their counts


    // Iterate over each object in the operations array
    operations.forEach(operation => {
        // Create a key for the unique combination of projectName, tp, and version
        const key = `${operation.projectName}-${operation.tp}-${operation.version}`;

        // If the key doesn't exist in the uniqueCombinations object, initialize its count to 0
        if (!uniqueCombinations[key]) {
            uniqueCombinations[key] = 0;
        }

        // Increment the count for the current combination
        uniqueCombinations[key]++;
    });

    // Convert the uniqueCombinations object into the desired format
    const result = Object.entries(uniqueCombinations).map(([key, count]) => {
        const [projectName, tp, version] = key.split('-'); // Split the key back into projectName, tp, and version
        return [projectName, tp, version, count];
    });

    return result;
}
export function updateSelectedOptions(br_ops) {
    for (let index = 0; index < br_ops.length; index++) {
        let operation = br_ops[index];
        let content = operation.typicalActivity.content;
        // Update the material select
        const materialValue = operation.materialIN.name;
        content = content.replace(/<select name="material">([\s\S]*?)<\/select>/, (match, options) => {
            return `<select name="material">${setSelectedOption(options, materialValue)}</select>`;
        });

        // Update the reactor select
        const reactorValue = operation.mainEquipment.code;
        content = content.replace(/<select name="reactor">([\s\S]*?)<\/select>/, (match, options) => {
            return `<select name="reactor">${setSelectedOption(options, reactorValue)}</select>`;
        });

        br_ops[index].typicalActivity.content = content;
    }
    return br_ops;
}
function setSelectedOption(options, value) {
    return options.replace(/<option value="([^"]*)">/g, (match, optionValue) => {
        if (optionValue === value) {
            return `<option value="${optionValue}" selected>`;
        }
        return match;
    });
}



