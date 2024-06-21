

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}



// async function GetBR(project, tp, version) {
//   await delay(500); // Simulating a delay of 500ms

//   const materialIn = new Material(0, "reagent", "test001-1");
//   const materialOut = new Material(0, "waste", "");
//   const equipment = "conv_oven";
  
//   const description = [
//     {
//       operation_type: "material_load_on_trays",
//       content: `Using shovel "{shovel}" product is loaded on trays.
//       Each tray is weighed on balances {balances}, data is recorded into Table <number>.
//       Tray is placed into drying oven.
//       After all product is loaded on trays and placed into oven, the oven is closed.
//       Heating is set {targetTempMin}{targetTempMax}°C.
//       Timer is set to {durationMin}{durationMax} .
//       The drying starts.`,
//       other: ``,
//     }
//   ];

//   const eq_in_operation = [
//     new EquipmentInfo("balances", "007-1", "max=3kg"),
//     new EquipmentInfo("shovel", "", "buto tp.1")
//   ];

//   const parameters = [
//     new Parameter("durationMin", 11),
//     new Parameter("durationMax", 21),
//     new Parameter("targetTempMin", 10),
//     new Parameter("targetTempMax", 30),
//     new Parameter("initialTempSet", 0),
//     new Parameter("finalTempSet", 0),
//     new Parameter("processTemp", 0),
//     new Parameter("rpmMin", 0),
//     new Parameter("rpmMax", 0),
//     new Parameter("flowMin", 0),
//     new Parameter("flowMax", 0),
//     new Parameter("ppumpSetMin", 0),
//     new Parameter("ppumpSetMax", 0),
//     new Parameter("vpumpTorrProcess", 0),
//     new Parameter("vpumpTorrMin", 0),
//     new Parameter("vpumpTorrMax", 0)
//   ];

//   const operations = [
//     new Operation(1, 1, materialIn, materialOut, equipment, description, eq_in_operation, parameters)
//   ];

//   const br = new BatchRecord("Buto", "tp.1", "1.0", operations);

//   return br;
// }

// // Simulating delay function
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }




async function GetEqMapMOCK() {
  await delay(500); // Simulating a delay of 500ms

  // Simulated list of equipment for different types
  const data = [
    {
      equipment: "balances",
      code: "007-1",
      description: "max=3kg",
    },
    {
      equipment: "balances",
      code: "007-10",
      description: "max=2kg",
    },
    {
      equipment: "balances",
      code: "007-12",
      description: "max=1kg",
    },
    {
      equipment: "balances",
      code: "007-16",
      description: "max=220kg",
    },
    {
      equipment: "balances",
      code: "007-21",
      description: "max=1.3kg",
    },
    {
      equipment: "balances",
      code: "007-25",
      description: "max=3.5kg",
    },
    {
      equipment: "balances",
      code: "007-26",
      description: "max=3.5kg",
    },
    {
      equipment: "balances",
      code: "007-27",
      description: "max=3.5kg",
    },
    {
      equipment: "balances",
      code: "007-34",
      description: "max=3.5kg",
    },
    {
      equipment: "balances",
      code: "007-6",
      description: "max=10kg",
    },
    {
      equipment: "balances",
      code: "007-20",
      description: "max=3kg",
    },
    {
      equipment: "balances",
      code: "007-23",
      description: "max=150kg",
    },
    {
      equipment: "balances",
      code: "007-24",
      description: "max=30kg",
    },
    {
      equipment: "balances",
      code: "007-39",
      description: "max=30kg",
    },
    {
      equipment: "balances",
      code: "007-40",
      description: "max=30kg",
    },
    {
      equipment: "balances",
      code: "007-41",
      description: "max=3kg",
    },
    {
      equipment: "balances",
      code: "007-42",
      description: "max=30kg",
    },
    {
      equipment: "balances",
      code: "007-43",
      description: "max=1kg",
    },
    {
      equipment: "balances",
      code: "007-44",
      description: "max=120kg",
    },
    {
      equipment: "balances",
      code: "007-45",
      description: "max=60kg",
    },
    {
      equipment: "reactor",
      code: "002-10",
      description: "30L glass",
    },
    {
      equipment: "reactor",
      code: "002-11",
      description: "15L glass",
    },
    {
      equipment: "reactor",
      code: "002-12",
      description: "150L glass",
    },
    {
      equipment: "reactor",
      code: "002-13",
      description: "100L glass",
    },
    {
      equipment: "reactor",
      code: "002-14",
      description: "100L g-lined",
    },
    {
      equipment: "reactor",
      code: "002-15",
      description: "150L glass",
    },
    {
      equipment: "reactor",
      code: "002-16",
      description: "50L glass",
    },
    {
      equipment: "reactor",
      code: "002-17",
      description: "100L glass",
    },
    {
      equipment: "d_filter",
      code: "046-4",
      description: "ss 40/80L",
    },
    {
      equipment: "d_filter",
      code: "046-6",
      description: "ss 30/45L",
    },
    {
      equipment: "d_filter",
      code: "046-7",
      description: "ss agit 100/140L",
    },
    {
      equipment: "n_filter",
      code: "046-1",
      description: "",
    },
    {
      equipment: "n_filter",
      code: "046-13",
      description: "",
    },
    {
      equipment: "n_filter",
      code: "046-14",
      description: "",
    },
    {
      equipment: "n_filter",
      code: "046-2",
      description: "",
    },
    {
      equipment: "n_filter",
      code: "046-3",
      description: "",
    },
    {
      equipment: "m_pump",
      code: "001-22",
      description: "",
    },
    {
      equipment: "m_pump",
      code: "001-23",
      description: "",
    },
    {
      equipment: "m_pump",
      code: "001-24",
      description: "",
    },
    {
      equipment: "p_pump",
      code: "001-13",
      description: "",
    },
    {
      equipment: "p_pump",
      code: "001-21",
      description: "",
    },
    {
      equipment: "p_pump",
      code: "001-29",
      description: "",
    },
    {
      equipment: "o_pump",
      code: "001-38",
      description: "",
    },
    {
      equipment: "o_pump",
      code: "001-43",
      description: "",
    },
    {
      equipment: "vac_oven",
      code: "012-10",
      description: "",
    },
    {
      equipment: "vac_oven",
      code: "012-15",
      description: "",
    },
    {
      equipment: "vac_oven",
      code: "012-17",
      description: "",
    },
    {
      equipment: "vac_oven",
      code: "012-9",
      description: "",
    },
    {
      equipment: "conv_oven",
      code: "012-13",
      description: "",
    },
    {
      equipment: "conv_oven",
      code: "012-14",
      description: "",
    },
    {
      equipment: "conv_oven",
      code: "012-16",
      description: "",
    },
    {
      equipment: "conv_oven",
      code: "012-6",
      description: "",
    },
  ];
  

  // Return the simulated equipment list for the specified type
  return {data};
}

async function GetEqOps() {
  await delay(500); // Simulating a delay of 500ms

  // Simulated list of equipment types
  const activities = [
    {
      id: 1,
      equipment: "reactor",
      description: [
        {
          operation_type: "prepare_of_reactor",
          content: `Reactor preparation:
    The reactor {reactor} and thermostat are checked to be ready for work. 
    A stirrer drive is installed.
    On lid (clockwise):
    1. Reflux condenser on ball ground joint
    2. 60 mm flange port (with lid)
    3. Valve (for loading liquid).
    4. Overpressure release valve
    5. Liquid dosage system
    6. Thermometer
    7. Valve with PTFE tubing for sparging of argon, closed, connected to argon cylinder with reducing valve;
    The cold trap is connected behind the reactor.`,
          other: ``,
        },
        {
          operation_type: "material_load_of_solid",
          content: `Loading into reactor:
    Required amount of {material} is weighed on the balances {balances} into jug "{jug}" using a plastic scoop. 
    Weighted material is loaded into reactor {reactor} in portions via a 60 mm flange port using funnel "{funnel}". 
    The 60 mm flange port is closed.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg`,
        },
        {
          operation_type: "material_load_of_liquid",
          content: `Loading into reactor:
    Required amount of {material} is weighed on the balances {balances} using jug "{jug}". 
    Using peristaltic pump  {p_pump} and norprene hose "{hose}", weighted material is pumped into the reactor via a liquid loading valve. 
    The peristaltic pump is set to {ppumpSetMin} {ppumpSetMax}%. 
    After loading is done, the pump is stopped, and the hose is removed. 
    The 60 mm flange port is closed. 
    The hose is cleaned and dried.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg
    Actual pump
    setting: ..... %`,
        },
        {
          operation_type: "material_load_drop_funnel",
          content: `Loading into dropping funnel:
    The required amount of {material} is weighed on the balances {balances} using jug "{jug}". 
    Using peristaltic pump  {p_pump} and norprene hose "{hose}", weighted material is pumped into the dosing system. 
    The peristaltic pump is set to {ppumpSetMin} {ppumpSetMax}%. 
    After loading is done, the pump is stopped, hose is removed. 
    The dosing system is closed. The hose is cleaned and dried.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg
    Actual pump
    setting: ..... %`,
        },
        {
          operation_type: "material_add_dropwise",
          content: `Dropwise addition:
    Material is added dropwise from dropping funnel.
    Addition is temperature controlled.
    Keep the temperature of reaction mixture in range {targetTempMin}{targetTempMax}°C.
    Set the thermostat to the temperature {initialTempSet}°C.
    Once temperaute in require range, change the setting of thermostat to {finalTempSet}°C.
    Stirring is set to range {rpmMin}{rpmMax} rpm.`,
          other: `Actual thermostat
    setting: ..... °C
    Actual stirring
    setting: .... rpm`,
        },
        {
          operation_type: "argon_start_flow",
          content: `Argon flow:
    Argon line is connected to the argon port of reactor {reactor}. 
    The Argon flow is set to {flowMin}{flowMax}l/min. 
    The valve is opened.`,
          other: `Actual flow
    setting: .... l/min`,
        },
        {
          operation_type: "argon_stop_flow",
          content: `After the required time is passed, the argon flow is closed.`,
          other: `Actual flow
    setting: .... l/min`,
        },
        {
          operation_type: "reaction_hold_time",
          content: `Hold time:
    Reaction mixture is stirred during {durationMin}{durationMax} . 
    Temperature set is {targetTempMin}{targetTempMax}°C. 
    Stirring is set to {rpmMin}{rpmMax} rpm.`,
          other: `Actual temp
    setting: ..... °C
    Actual stirring
    setting: .... rpm`,
        },
        {
          operation_type: "reaction_stir_ON",
          content: `Stirring in reactor {reactor} is turned ON. 
    Set to {rpmMin}{rpmMax} rpm.`,
          other: `Actual stirring
    setting: .... rpm`,
        },
        {
          operation_type: "reaction_stir_OFF",
          content: "Stirring in reactor {reactor} is turned OFF.",
          other: ``,
        },
        {
          operation_type: "reaction_heat/cool_ON",
          content: `<Heating/cooling> of reactor {reactor} is turned ON.
    The target temperature range is {targetTempMin}{targetTempMax}°C.  
    Temperature is set to {initialTempSet}°C. 
    Once the temperature is in a given range, the setting is changed to {finalTempSet}°C.`,
          other: `Actual temp
    setting: ..... °C`,
        },
        {
          operation_type: "vac_dist.",
          content: `Vacuum distillation:
    Solvent is distilled out from reactor.
    Tap water for condenser is turned ON.
    Heating is set {targetTempMin}{targetTempMax}°C.
    Stirring is set {rpmMin}{rpmMax} rpm.
    Membrane pump is connected via cold trap and turned ON.
    Vacuum is gradually decreased in range {vpumpTorrMin}{vpumpTorrMax} torr.
    Distillation is continued until <conditions>.`,
          other: `Actual temp
    setting: ..... °C
    Actual stirring
    setting: ..... rpm
    Actual vacuum
    setting: ..... Torr`,
        },
        {
          operation_type: "material_unload",
          content: `<Solution/suspension> from reactor is pumped using peristaltic pump {p_pump} and norprene hose "{hose}".
    One end of the hose is connected to the bottom valve of reactor {reactor}.
    Second end passed through the peristaltic pump and into <to where?>.`,
          other: ``,
        },
      ],
    },
    {
      id: 2,
      equipment: "d_filter",
      description: [
        {
          operation_type: "prepare_filter",
          content: `Filter preparation:
    The filter {d_filter} is assembled and prepared to work. 
    The filtration cloth is prepared and properly installed. 
    Argon and product lines are connected to the lid, pressure test is done.`,
          other: ``,
        },
        {
          operation_type: "load_on_filter",
          content: `Product is loaded from reactor {reactor} on the filter {d_filter} via product line. 
    The Argon line is closed during loading. 
    Once 2/3 of the filter is loaded, stop pumping and close the product line.`,
          other: ``,
        },
        {
          operation_type: "filtration_with_argon",
          content: `Filtration:
    Check that the product line is closed, and check the pressure on Argon cylinder, it must be in the range 0.5-1bar. 
    Open the argon line on the lid of the filter {d_filter} and wait until no more or very little of ML is coming into the receiver (visually on the level tube). 
    At the end of operation close the argon line.`,
          other: ``,
        },
        {
          operation_type: "discharg_ML",
          content: `Emptying the receiver:
    Check that the product line and argon line are closed. 
    Release the top valve on the receiver to make sure there is no extra pressure. 
    Connect peristaltic pump {p_pump} to the bottom valve of the filter {d_filter} using norprene hose "{hose}". 
    The second end of the hose is securely fixed into the receiving container canister, set the speed of the peristaltic pump {ppumpSetMin} {ppumpSetMax} %. 
    Start the pump. Continue the process until all ML is unloaded into the receiver.`,
          other: ``,
        },
        {
          operation_type: "wash_FK",
          content: `Washing filter cake:
    The lid of filter {d_filter} is opened. 
    The required amount of {material} is weighed on the balances {balances} using a jug "{jug}". 
    The solvent is loaded on top of the filter cake, using shovel "{shovel}" the filter cake is thoroughly mixed. 
    The lid is closed.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg`,
        },
        {
          operation_type: "dry_on_filter",
          content: `Drying on filter:
    The filter cake is additionally dried on the filter {d_filter} using argon flow. 
    Argon is set to {flowMin}{flowMax} l/min, check that the outlet valve is opened and the stream is led to the ventilation. 
    Argon line is opened. 
    Drying on the filter is continued for {durationMin}{durationMax} min. 
    After the required time is passed, the argon line is closed.`,
          other: `Actual flow
    setting: .... l/min`,
        },
        {
          operation_type: "unload_from_filter",
          content: `The lid of the filter {d_filter} is opened. 
    Material from the filter is unloaded using shovel "{shovel}" <to where>.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg`,
        },
      ],
    },
    {
      id: 3,
      equipment: "n_filter",
      description: [
        {
          operation_type: "prepare_filter",
          content: `Filter preparation:
    The filter {n_filter} is assembled and prepared to work. 
    The filtration cloth is prepared and properly installed. 
    Membrane pump {m_pump} is connected.`,
          other: ``,
        },
        {
          operation_type: "load_on_filter",
          content: `Membrane pump {m_pump} is started. 
    The product is loaded on the filter {n_filter} using jug "{jug}". 
    Once 2/3 of the filter is loaded, stop loading.`,
          other: ``,
        },
        {
          operation_type: "discharg_ML",
          content: `Emptying the receiver:
    Stop the pump. 
    Connect peristaltic pump {p_pump} to the bottom valve of the filter using norprene hose "{hose}". 
    The second end of the hose is securely fixed into the receiving container canister, set the speed of the peristaltic pump {p_pump} %. 
    Start the pump. 
    Continue the process until all ML is unloaded into the respective receiver.`,
          other: ``,
        },
        {
          operation_type: "wash_FK",
          content: `Washing filter cake:
    Make sure the pump is stopped. 
    The required amount of material is weighed on the balances {balances} using a jug "{jug}". 
    Solvent {material} is loaded on top of filter cake, using shovel "{shovel}" the filter cake is thoroughly mixed.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg`,
        },
        {
          operation_type: "dry_on_filter",
          content: `Drying on filter:
    The filter cake is additionally dried on the filter by keeping the membrane pump sucking air through it. 
    Membrane pump {m_pump} is set to range {vpumpTorrMin}{vpumpTorrMax} Torr. 
    Drying on the filter is continued for {durationMin}{durationMax}  min. 
    After the required time is passed, the pump is stopped.`,
          other: `Actual plump
    setting: ..... Torr`,
        },
        {
          operation_type: "unload_from_filter",
          content: `The lid of the filter {n_filter} is opened. 
    Material from the filter is unloaded using shovel "{shovel}" <to where>.
    
    Specified amount: ….. kg (….. - ….. kg)`,
          other: `Warehouse code:
    ...........
    Actual loading:
    ....... kg`,
        },
      ],
    },
    {
      id: 4,
      equipment: "p_pump",
      description: [
        {
          operation_type: "pump_ON",
          content: `Peristaltic pump {p_pump} is set to {ppumpSetMin} {ppumpSetMax} %.
    Pump is turned ON`,
          other: ``,
        },
      ],
    },
    {
      id: 5,
      equipment: "conv_oven",
      description: [
        {
          operation_type: "material_load_on_trays",
          content: `Using shovel "{shovel}" product is loaded on trays.
    Each tray is weighed on balances {balances}, data is recorded into Table <number>.
    Tray is placed into drying oven.
    After all product is loaded on trays and placed into oven, the oven is clodes.
    Heating is set {targetTempMin}{targetTempMax}°C.
    Timer is set to {durationMin}{durationMax} .
    The dryining starts.`,
          other: ``,
        },
        {
          operation_type: "material_unload_from_trays",
          content: `Oven is truned OFF.
    Oven is opened.
    Each tray is taken from the oven and weighed on the balances {balances}.
    Mass is recorded into BR table <number>.
    Using shovel "{shovel}" product is unloaded from each tray into PE bag.`,
          other: ``,
        },
      ],
    },
  ];

  return activities;
}

async function GetBR(project, tp, version) {
  await delay(500); // Simulating a delay of 500ms

  // Simulated list of equipment types
  const data = {
    project: "Buto",
    tp: "tp.1",
    version: "1.0",
    operations: [
      {
        id: 1,
        opNumb: 1,
        materialIn: {
          mass: 0,
          typeIn: "reagent", //e.g. SM, reagent, solvent, process aid
          wh_code: "test001-1",
        },
        materialOut: {
          mass: 0,
          typeOut: "waste", //e.g. IP or waste
        },
        equipment: "conv_oven",
        description: [
          {
            operation_type: "material_load_on_trays",
            content: `Using shovel "{shovel}" product is loaded on trays.
            Each tray is weighed on balances {balances}, data is recorded into Table <number>.
            Tray is placed into drying oven.
            After all product is loaded on trays and placed into oven, the oven is clodes.
            Heating is set {targetTempMin}{targetTempMax}°C.
            Timer is set to {durationMin}{durationMax} .
            The dryining starts.`,
            other: ``,
          },
        ],
        eq_in_operation: [
          {
            equipment: "balances",
            code: "007-39",
            description: "max=30kg",
          },
          {
            equipment: "shovel",
            code: "",
            description: "but tp.1",
          },
        ],
        parameters: [
          { parameter: "durationMin", value:11 },
          { parameter: "durationMax", value:21 },
          { parameter: "targetTempMin", value:10},
          { parameter: "targetTempMax", value:30 },
          { parameter: "initialTempSet", value:0 },
          { parameter: "finalTempSet", value:0 },
          { parameter: "processTemp", value:0 },
          { parameter: "rpmMin", value:0 },
          { parameter: "rpmMax", value:0 },
          { parameter: "flowMin", value:0 },
          { parameter: "flowMax", value:0 },
          { parameter: "ppumpSetMin", value:0 },
          { parameter: "ppumpSetMax", value:0 },
          { parameter: "vpumpTorrProcess", value:0 },
          { parameter: "vpumpTorrMin", value:0 },
          { parameter: "vpumpTorrMax", value:0 }
        ]
      },
    ],
  };
  return data;
}

async function GetParamsMOCK() {
  await delay(500); // Simulating a delay of 500ms
  // Simulated list of parameters for operations
  const parameters = [
    { id: 1, parameter: "durationMin" },
    { id: 2, parameter: "durationMax" },
    { id: 3, parameter: "targetTempMin" },
    { id: 4, parameter: "targetTempMax" },
    { id: 5, parameter: "initialTempSet" },
    { id: 6, parameter: "finalTempSet" },
    { id: 7, parameter: "processTemp" },
    { id: 8, parameter: "rpmMin" },
    { id: 9, parameter: "rpmMax" },
    { id: 10, parameter: "flowMin" },
    { id: 11, parameter: "flowMax" },
    { id: 12, parameter: "ppumpSetMin" },
    { id: 13, parameter: "ppumpSetMax" },
    { id: 14, parameter: "vpumpTorrProcess" },
    { id: 15, parameter: "vpumpTorrMin" },
    { id: 16, parameter: "vpumpTorrMax" }
  ];
  return parameters;
}

export { GetEqMapMOCK, GetEqOps, GetParamsMOCK, GetBR };
