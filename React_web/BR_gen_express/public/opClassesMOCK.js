class Material {
  constructor(reagent = "SM.1", mass = 0, type = "Reagent", wh_code = "") {
    this.reagent = reagent;
    this.mass = mass;
    this.type = type;
    this.wh_code = wh_code;
  }
}

class EquipmentInfo {
  constructor(equipment = "none", code = "none", description = "none") {
    this.equipment = equipment;
    this.code = code;
    this.description = description;
  }
}

class Parameter {
  constructor(parameter = "none", value = 0) {
    this.parameter = parameter;
    this.value = value;
  }
}

class Operation {
  constructor(
    id,
    opNumb,
    materialIn = new Material(),
    materialOut = new Material(),
    mainEqName = "none",
    description = "none",
    eq_in_operation = [new EquipmentInfo()],
    parameters = new Parameter()
  ) {
    this.id = id;
    this.opNumb = opNumb;
    this.materialIn = materialIn;
    this.materialOut = materialOut;
    this.mainEqName = mainEqName;  // Corrected this line
    this.description = description;
    this.eq_in_operation = eq_in_operation;
    this.parameters = parameters;
  }
}

class BatchRecord {
  constructor(project = "none", tp = "none", version = "none", operations = [new Operation()]) {
    this.project = project;
    this.tp = tp;
    this.version = version;
    this.operations = operations;
  }
}

export { BatchRecord, Operation, Parameter, EquipmentInfo, Material };
