export interface PredictionRequest {
  area: number;
  budget: number;
  ph: number;
  rainfall: number;
}

export interface PredictionResponse {
  crop: string;
  confidence: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function predictCrop(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${BASE_URL}/predict_crop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': 'your_api_key_here'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Prediction failed: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get prediction');
  }
}
