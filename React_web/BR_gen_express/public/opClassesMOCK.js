
class Material {
  constructor(mass, type, wh_code) {
    this.mass = mass;
    this.type = type;
    this.wh_code = wh_code;
  }
}
class EquipmentInfo {
  constructor(equipment, code, description) {
    this.equipment = equipment;
    this.code = code;
    this.description = description;
  }
}

class Parameter {
  constructor(parameter, value) {
    this.parameter = parameter;
    this.value = value;
  }
}
class Operation {
  constructor(id, opNumb, materialIn, materialOut, equipment, description, eq_in_operation, parameters) {
    this.id = id;
    this.opNumb = opNumb;
    this.materialIn = materialIn;
    this.materialOut = materialOut;
    this.equipment = equipment;
    this.description = description;
    this.eq_in_operation = eq_in_operation;
    this.parameters = parameters;
  }
}
class BatchRecord {
  constructor(project, tp, version, operations) {
    this.project = project;
    this.tp = tp;
    this.version = version;
    this.operations = operations;
  }
}

export {BatchRecord, Operation, Parameter, EquipmentInfo, Material }
