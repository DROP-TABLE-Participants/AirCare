import axiosInstance from '../axiosInstance';
import { FailurePredictionIM, FailurePredictionVM } from '../models/failureData';
import { RulForecastIM, RulForecastVM } from '../models/rulData';

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
