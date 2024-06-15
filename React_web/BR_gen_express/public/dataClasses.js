
export class LocalMemory {
    constructor(apiRespData = {}) {
        this.projectName = apiRespData?.projectName || "";
        this.tp = apiRespData?.tp || "";
        this.version = apiRespData?.version || "";
        this.equipmentSet = apiRespData?.equipmentSet || [];
        this.reagentSet = apiRespData?.reagentSet || [];
    }
}



// Define a Reagent class to represent each reagent
export class Reagent {
    constructor(tableID, name, mass) {
        this.tableID = tableID;
        this.name = name;
        this.mass = mass;
    }
}



export class EquipmentNoOperation {
    constructor(name = "none", equipmentInfo = [{}], operations = []) {
        this.name = name;
        this.equipmentInfo = equipmentInfo.map(info => new EquipmentInfo(info.code, info.description));
        this.operations = operations.map(op => new Operation(op.operationType, op.content, op.other));
    }
}

export class EquipmentInfo {
    constructor(code = "", description = "") {
        this.code = code;
        this.description = description;
    }
}

export class Operation {
    constructor(operationType = "", content = "", other = "") {
        this.operationType = operationType;
        this.content = content;
        this.other = other;
    }
}

