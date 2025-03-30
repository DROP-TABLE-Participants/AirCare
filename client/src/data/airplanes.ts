export const airplanes = [
  {
    id: 'boeing737',
    name: 'Boeing 737 Boris Air',
    partsHealth: [
      { name: 'leftWing', faulty: true, faultMessage: 'Left Wing: Structural damage detected.' },
      { name: 'rightWing', faulty: false },
      { name: 'backLeftWing', faulty: true, faultMessage: 'Fuel System: Low pressure in fuel line.' },
    ],
    engineHealth: [
      { name: "Jan", value: 92 },
      { name: "Feb", value: 90 },
      { name: "Mar", value: 88 },
      { name: "Apr", value: 86 },
      { name: "May", value: 85 },
      { name: "Jun", value: 84 }
    ],
    fuelEfficiency: [
      { name: "Jan", value: 87 },
      { name: "Feb", value: 85 },
      { name: "Mar", value: 83 },
      { name: "Apr", value: 82 },
      { name: "May", value: 80 },
      { name: "Jun", value: 78 }
    ],
    flightIndex: 825,
    parts: [
      { name: "Engine", status: "Good" },
      { name: "Landing Gear", status: "Likely To Fail" },
      { name: "Electrical Systems", status: "Good" },
      { name: "Hydraulic Systems", status: "Good" },
      { name: "Flight Control Surfaces", status: "Check Mandatory" },
      { name: "Navigation & Communication Systems", status: "Possible Fault" },
      { name: "Avionics", status: "Good" },
      { name: "Fuel System", status: "Likely To Fail" },
      { name: "Oxygen System", status: "Good" },
      { name: "De-Icing System", status: "Check Mandatory" },
    ]
  },
  {
    id: 'airbusA320',
    name: 'Airbus A320 SkyTrack',
    partsHealth: [
      { name: 'backLeftWing', faulty: true, faultMessage: 'Landing Gear: Retraction failure warning.' },
      { name: 'leftWing', faulty: false },
      { name: 'backRightWing', faulty: false },
    ],
    engineHealth: [
      { name: "Jan", value: 94 },
      { name: "Feb", value: 92 },
      { name: "Mar", value: 90 },
      { name: "Apr", value: 89 },
      { name: "May", value: 88 },
      { name: "Jun", value: 87 }
    ],
    fuelEfficiency: [
      { name: "Jan", value: 85 },
      { name: "Feb", value: 84 },
      { name: "Mar", value: 82 },
      { name: "Apr", value: 80 },
      { name: "May", value: 79 },
      { name: "Jun", value: 77 }
    ],
    flightIndex: 812,
    parts: [
      { name: "Engine", status: "Good" },
      { name: "Landing Gear", status: "Likely To Fail" },
      { name: "Electrical Systems", status: "Good" },
      { name: "Hydraulic Systems", status: "Good" },
      { name: "Flight Control Surfaces", status: "Check Mandatory" },
      { name: "Navigation & Communication Systems", status: "Possible Fault" },
      { name: "Avionics", status: "Good" },
      { name: "Fuel System", status: "Likely To Fail" },
      { name: "Oxygen System", status: "Good" },
      { name: "De-Icing System", status: "Check Mandatory" },
    ]
  },
  {
    id: 'embraer190',
    name: 'Embraer 190 FalconJet',
    partsHealth: [
      { name: 'leftWing', faulty: true, faultMessage: 'De-Icing System: Ice accumulation not melting properly.' },
      { name: 'rightWing', faulty: false },
      { name: 'backRightWing', faulty: true, faultMessage: 'Avionics: Communication signal dropout.' },
    ],
    engineHealth: [
      { name: "Jan", value: 90 },
      { name: "Feb", value: 88 },
      { name: "Mar", value: 87 },
      { name: "Apr", value: 85 },
      { name: "May", value: 83 },
      { name: "Jun", value: 82 }
    ],
    fuelEfficiency: [
      { name: "Jan", value: 88 },
      { name: "Feb", value: 86 },
      { name: "Mar", value: 85 },
      { name: "Apr", value: 83 },
      { name: "May", value: 81 },
      { name: "Jun", value: 80 }
    ],
    flightIndex: 780,
    parts: [
      { name: "Engine", status: "Good" },
      { name: "Landing Gear", status: "Likely To Fail" },
      { name: "Electrical Systems", status: "Good" },
      { name: "Hydraulic Systems", status: "Good" },
      { name: "Flight Control Surfaces", status: "Check Mandatory" },
      { name: "Navigation & Communication Systems", status: "Possible Fault" },
      { name: "Avionics", status: "Good" },
      { name: "Fuel System", status: "Likely To Fail" },
      { name: "Oxygen System", status: "Good" },
      { name: "De-Icing System", status: "Check Mandatory" },
    ]
  },
  {
    id: 'antonovAn225',
    name: 'Antonov AN-225 MegaLift',
    partsHealth: [
      { name: 'leftWing', faulty: true, faultMessage: 'Engine: Overheating detected in turbine module.' },
      { name: 'rightWing', faulty: false },
      { name: 'backLeftWing', faulty: false },
    ],
    engineHealth: [
      { name: "Jan", value: 95 },
      { name: "Feb", value: 94 },
      { name: "Mar", value: 93 },
      { name: "Apr", value: 91 },
      { name: "May", value: 90 },
      { name: "Jun", value: 89 }
    ],
    fuelEfficiency: [
      { name: "Jan", value: 80 },
      { name: "Feb", value: 78 },
      { name: "Mar", value: 77 },
      { name: "Apr", value: 75 },
      { name: "May", value: 74 },
      { name: "Jun", value: 73 }
    ],
    flightIndex: 950,
    parts: [
      { name: "Engine", status: "Good" },
      { name: "Landing Gear", status: "Likely To Fail" },
      { name: "Electrical Systems", status: "Good" },
      { name: "Hydraulic Systems", status: "Good" },
      { name: "Flight Control Surfaces", status: "Check Mandatory" },
      { name: "Navigation & Communication Systems", status: "Possible Fault" },
      { name: "Avionics", status: "Good" },
      { name: "Fuel System", status: "Likely To Fail" },
      { name: "Oxygen System", status: "Good" },
      { name: "De-Icing System", status: "Check Mandatory" },
    ]
  }
];
