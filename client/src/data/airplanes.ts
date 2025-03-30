interface PartHealth {
  name: string;
  faulty: boolean;
  faultMessage?: string;
}

interface DataPoint {
  name: string;
  value: number;
}

interface Part {
  name: string;
  status: string;
}

interface Airplane {
  id: string;
  name: string;
  partsHealth: PartHealth[];
  engineHealth: DataPoint[];
  fuelEfficiency: DataPoint[];
  flightIndex: number | null;
  parts: Part[];
}

export const airplanes: Airplane[] = [
  {
    id: 'boeing737',
    name: 'Boeing 737 Boris Air',
    partsHealth: [],
    engineHealth: [],
    fuelEfficiency: [],
    flightIndex: null,
    parts: []
  },
  {
    id: 'airbusA320',
    name: 'Airbus A320 SkyTrack',
    partsHealth: [],
    engineHealth: [],
    fuelEfficiency: [],
    flightIndex: null,
    parts: []
  },
  {
    id: 'embraer190',
    name: 'Embraer 190 FalconJet',
    partsHealth: [],
    engineHealth: [],
    fuelEfficiency: [],
    flightIndex: null,
    parts: []
  },
  {
    id: 'antonovAn225',
    name: 'Antonov AN-225 MegaLift',
    partsHealth: [],
    engineHealth: [],
    fuelEfficiency: [],
    flightIndex: null,
    parts: []
  }
];

export type { Airplane, PartHealth, DataPoint, Part };
