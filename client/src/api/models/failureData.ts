import { SensorData } from "./sensorData";

/**
 * Failure Prediction Request Model
 */
export interface FailurePredictionIM {
    aircraftModel: string;       // minimum length: 1
    origin: string;              // exactly 4 characters
    destination: string;         // exactly 4 characters
    flightCycles: number;        // 1 to 2147483647
    flightHours: number;         // 1 to 2147483647
    payloadWeight: number;       // 1 to 2147483647
    departureTime: string;       // ISO date-time
    arrivalTime: string;         // ISO date-time
    sensorsData: SensorData;
  }
  
  /**
   * Part Failure (optional properties in the response)
   */
  export interface PartFailure {
    part?: string | null;
    failureProbability?: string | null;
    reason?: string | null;
  }
  
  /**
   * Failure Prediction Response Model
   */
  export interface FailurePredictionVM {
    partFailures?: PartFailure[] | null;
    featureIndex?: number;
  }