import { NextResponse } from 'next/server'

interface PredictionInput {
  area: number;
  budget: number;
  ph: number;
  rainfall: number;
}

export async function POST(request: Request) {
  try {
    const data: PredictionInput = await request.json();
    
    // Validate input
    if (!data.area || !data.budget || !data.ph || !data.rainfall) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict_crop`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'your_api_key_here'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Prediction service error: ${errorText}`);
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
