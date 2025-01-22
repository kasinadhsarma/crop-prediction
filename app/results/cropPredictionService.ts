export interface PredictionInput {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface PredictionResult {
  crop?: string;
  error?: string;
}

export type CropPredictionService = {
  predict: (input: PredictionInput) => Promise<PredictionResult>;
}