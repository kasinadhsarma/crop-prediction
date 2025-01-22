'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { SoilSuggestions } from '@/components/SoilSuggestions';

interface ParsedData {
  crop: string;
  confidence: number;
  inputs: {
    land: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    soilType: string;
    budget: number;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  suggested_fertilizers: string;
  suggested_pesticides: string;
  potential_diseases: string;
  estimated_yield_tons_per_acre: number;
  soil_recommendations: {
    'pH Value': string;
    Nitrogen: string;
    Phosphorus: string;
    Potassium: string;
  };
  water_requirement_mm: string;
  details: {
    scaler_used: string;
    model_used: string;
  };
}

interface ResultsClientProps {
  initialData?: ParsedData | null;
}

export default function ResultsClient({ initialData }: ResultsClientProps) {
  const [parsedData, setParsedData] = useState<ParsedData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setParsedData(initialData);
      setIsLoading(false);
    } else {
      setError('No data available');
      setIsLoading(false);
    }
  }, [initialData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <Loader2 className="h-16 w-16 animate-spin text-green-600" />
        <p className="mt-4 text-green-700">Fetching results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <div className="flex gap-4 mt-4">
              <Button asChild variant="outline">
                <Link href="/predict">Try Again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No data available to display.</p>
            <div className="flex gap-4 mt-4">
              <Button asChild variant="outline">
                <Link href="/predict">Go Back</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const soilRecommendations = parsedData.soil_recommendations || {
    'pH Value': 'N/A',
    Nitrogen: 'N/A',
    Phosphorus: 'N/A',
    Potassium: 'N/A',
  };

  return (
    <div className="min-h-screen bg-green-50">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Crop Yield Prediction Results</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Crop Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">Suggested Crop:</span> {parsedData.crop || 'N/A'}</p>
              <p><span className="font-medium">Confidence:</span> {parsedData.confidence || 'N/A'}</p>
              <p><span className="font-medium">Suggested Fertilizers:</span> {parsedData.suggested_fertilizers || 'N/A'}</p>
              <p><span className="font-medium">Suggested Pesticides:</span> {parsedData.suggested_pesticides || 'N/A'}</p>
              <p><span className="font-medium">Potential Diseases:</span> {parsedData.potential_diseases || 'N/A'}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Soil Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">pH Value:</span> {soilRecommendations['pH Value']}</p>
              <p><span className="font-medium">Nitrogen:</span> {soilRecommendations.Nitrogen}</p>
              <p><span className="font-medium">Phosphorus:</span> {soilRecommendations.Phosphorus}</p>
              <p><span className="font-medium">Potassium:</span> {soilRecommendations.Potassium}</p>
              <p><span className="font-medium">Water Requirement:</span> {parsedData.water_requirement_mm || 'N/A'} mm</p>
            </CardContent>
          </Card>
        </div>

        <SoilSuggestions phValue={soilRecommendations['pH Value']} />

        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle>Yield Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p><span className="font-medium">Estimated Yield:</span> {parsedData.estimated_yield_tons_per_acre || 'N/A'} tons/acre</p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

