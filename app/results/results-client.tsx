'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PredictionResult {
  crop?: string;
  error?: string;
}

interface PredictionInput {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export default function ResultsClient({ 
  searchParams 
}: { 
  searchParams: { data?: string } 
}) {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputParams, setInputParams] = useState<PredictionInput | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!searchParams?.data) {
        setIsLoading(false);
        return;
      }

      try {
        const params = JSON.parse(searchParams.data);
        setInputParams(params);

        const response = await fetch('http://127.0.0.1:5000/predict_crop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();
        setPrediction(data);
      } catch (error) {
        console.error('Error:', error);
        setPrediction({ error: 'Failed to get prediction' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrediction();
  }, [searchParams?.data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {prediction?.error ? (
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{prediction.error}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Predicted Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-2xl font-bold mb-4">{prediction?.crop}</p>
              {inputParams && (
                <div className="space-y-2">
                  <p>Temperature: {inputParams.temperature}°C</p>
                  <p>Humidity: {inputParams.humidity}%</p>
                  <p>pH: {inputParams.ph}</p>
                  <p>Rainfall: {inputParams.rainfall} mm</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="mt-6 flex justify-center">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}