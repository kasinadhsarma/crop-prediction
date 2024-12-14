import { NextResponse } from 'next/server'

interface PredictionInput {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export async function POST(request: Request) {
  try {
    const data: PredictionInput = await request.json();
    
    // Validate input
    if (!data.temperature || !data.humidity || !data.ph || !data.rainfall) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    const response = await fetch('http://localhost:5000/predict_crop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Backend error:', await response.text());
      throw new Error('Prediction service error');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to get prediction' }, 
      { status: 500 }
    );
  }
}