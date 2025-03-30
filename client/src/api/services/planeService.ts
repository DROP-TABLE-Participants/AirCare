import axiosInstance from '../axiosInstance';
import { FailurePredictionIM, FailurePredictionVM } from '../models/failureData';
import { RulForecastIM, RulForecastVM } from '../models/rulData';

export async function sendFailurePrediction(
  data: FailurePredictionIM
): Promise<FailurePredictionVM> {
  const response = await axiosInstance.post('/failure', data);
  return response.data;
}

export async function sendRulForecast(
  data: RulForecastIM
): Promise<RulForecastVM[]> {
  const response = await axiosInstance.post('/rul', data);
  return response.data;
}