import axiosInstance from './api/axiosInstance';

/**
 * SensorData schema used by both failure prediction and RUL forecast.
 */
export interface SensorData {
  oilPressure: number;                // min: 0, max: 500
  oilTemperature: number;             // min: -40, max: 150
  cylinderHeadTemperature: number;    // min: -40, max: 300
  engineVibration: number;            // min: 0, max: 100
  fuelFlowRate: number;               // min: 0, max: 10000
  engineRPM: number;                  // min: 0, max: 30000
  hydraulicPressure: number;          // min: 0, max: 5000
  cabinPressureDifferential: number;  // min: 0, max: 50
  outsideAirTemperature: number;      // min: -50, max: 50
}

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

/**
 * RUL Forecast Request Model
 */
export interface RulForecastIM {
  aircraftModel: string;               // minimum length: 1
  flightCycles: number;                // 1 to 2147483647
  flightHours: number;                 // 1 to 2147483647
  lastReplacementDateOfEngine: string; // ISO date-time
  sensorsData: SensorData;
}

/**
 * RUL Forecast Response Model
 */
export interface RulForecastVM {
  date: string;                // ISO date-time
  engineHealthPercentage: number;
  isOkayToFlight: boolean;
}

/**
 * Sends failure prediction data to the backend.
 * With the new default instance, the full endpoint is:
 * [baseURL]/failure
 */
export async function sendFailurePrediction(
  data: FailurePredictionIM
): Promise<FailurePredictionVM> {
  const response = await axiosInstance.post('/failure', data);
  return response.data;
}

/**
 * Sends RUL forecast data to the backend.
 * With the new default instance, the full endpoint is:
 * [baseURL]/rul
 */
export async function sendRulForecast(
  data: RulForecastIM
): Promise<RulForecastVM[]> {
  const response = await axiosInstance.post('/rul', data);
  return response.data;
}
