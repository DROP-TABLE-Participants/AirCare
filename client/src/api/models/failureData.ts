import { SensorData } from "./sensorData";

export interface FailurePredictionIM {
    aircraftModel: string;       
    origin: string;              
    destination: string;         
    flightCycles: number;        
    flightHours: number;         
    payloadWeight: number;       
    departureTime: string;       
    arrivalTime: string;         
    sensorsData: SensorData;
  }

  export interface PartFailure {
    part?: string | null;
    failureProbability?: string | null;
    reason?: string | null;
  }

  export interface FailurePredictionVM {
    partFailures?: PartFailure[] | null;
    featureIndex?: number;
  }