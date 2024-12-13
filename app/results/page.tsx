'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Results() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Parse the "data" from searchParams safely
    const rawData = searchParams.get('data');
    try {
      setData(JSON.parse(decodeURIComponent(rawData || '{}')));
    } catch (error) {
      console.error('Failed to parse search params:', error);
      setData({});
    }
  }, [searchParams]);

  if (!data) {
    return <p className="text-center text-lg">Loading results...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crop Yield Prediction Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crop Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Suggested Crop:</strong> {data.cropType || 'N/A'}</p>
            <p><strong>Suggested Fertilizers:</strong> {data.fertilizers?.join(', ') || 'N/A'}</p>
            <p><strong>Suggested Pesticides:</strong> {data.pesticides?.join(', ') || 'N/A'}</p>
            <p><strong>Potential Diseases:</strong> {data.diseases?.join(', ') || 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Soil Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>pH Value:</strong> {data.soilRecommendations?.pH || 'N/A'}</p>
            <p><strong>Nitrogen:</strong> {data.soilRecommendations?.nitrogen || 'N/A'} kg/ha</p>
            <p><strong>Phosphorus:</strong> {data.soilRecommendations?.phosphorus || 'N/A'} kg/ha</p>
            <p><strong>Potassium:</strong> {data.soilRecommendations?.potassium || 'N/A'} kg/ha</p>
            <p><strong>Water Requirement:</strong> {data.soilRecommendations?.water || 'N/A'} mm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Yield Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Estimated Yield:</strong> {data.yield || 'N/A'} tons/acre</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-center">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
