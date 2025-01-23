'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface CropData {
  crop: string;
  confidence: number;
  recommendations: {
    soil_requirements: {
      ph: number;
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
    water_requirement: number;
    estimated_yield: number;
    fertilizers: string;
    pesticides: string;
    potential_diseases: string;
    ph_analysis: {
      status: string;
      impact: string;
      adjustments: string;
      management: string;
    };
  };
}

export default function ResultsClient({ initialData }: { initialData?: CropData | null }) {
  const [data, setData] = useState<CropData | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
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
        <p className="mt-4 text-green-700">Processing results...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'No data available'}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/predict">Try Again</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <p><span className="font-medium">Suggested Crop:</span> {data.crop}</p>
              <p><span className="font-medium">Confidence:</span> {(data.confidence * 100).toFixed(1)}%</p>
              <p><span className="font-medium">Suggested Fertilizers:</span> {data.recommendations.fertilizers}</p>
              <p><span className="font-medium">Suggested Pesticides:</span> {data.recommendations.pesticides}</p>
              <p><span className="font-medium">Potential Diseases:</span> {data.recommendations.potential_diseases}</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Soil Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">pH Value:</span> {data.recommendations.soil_requirements.ph}</p>
              <p><span className="font-medium">Nitrogen:</span> {data.recommendations.soil_requirements.nitrogen} kg/ha</p>
              <p><span className="font-medium">Phosphorus:</span> {data.recommendations.soil_requirements.phosphorus} kg/ha</p>
              <p><span className="font-medium">Potassium:</span> {data.recommendations.soil_requirements.potassium} kg/ha</p>
              <p><span className="font-medium">Water Requirement:</span> {data.recommendations.water_requirement} mm</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white mb-6">
          <CardHeader>
            <CardTitle>Soil pH Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Status:</span> {data.recommendations.ph_analysis.status}</p>
            <p><span className="font-medium">Impact:</span> {data.recommendations.ph_analysis.impact}</p>
            <p><span className="font-medium">Recommended Adjustments:</span> {data.recommendations.ph_analysis.adjustments}</p>
            <p><span className="font-medium">Management Practices:</span> {data.recommendations.ph_analysis.management}</p>
          </CardContent>
        </Card>

        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle>Yield Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p><span className="font-medium">Estimated Yield:</span> {data.recommendations.estimated_yield} tons/acre</p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/predict">New Prediction</Link>
          </Button>
          <Button asChild className="bg-gray-900 text-white hover:bg-gray-800">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}