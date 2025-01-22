'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Mock data for a specific prediction
const mockPrediction = {
  id: 1,
  date: '2023-06-01',
  crop: 'Wheat',
  yield: 3.8,
  acres: 100,
  soilType: 'Loam',
  nitrogenLevel: 120,
  phosphorusLevel: 45,
  potassiumLevel: 80,
  pHLevel: 6.5,
  fertilizers: ['Urea', 'Superphosphate'],
  pesticides: ['Insecticide', 'Fungicide'],
  diseases: ['Rust', 'Mildew'],
  soilRecommendations: {
    pH: 6.8,
    nitrogen: 0,
    phosphorus: 5,
    potassium: 0,
    water: 450,
  },
}

export default function PredictionDetailPage() {

  // In a real application, you would fetch the prediction data based on the ID
  const prediction = mockPrediction

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Prediction Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Date:</strong> {prediction.date}</p>
            <p><strong>Crop Type:</strong> {prediction.crop}</p>
            <p><strong>Acres:</strong> {prediction.acres}</p>
            <p><strong>Soil Type:</strong> {prediction.soilType}</p>
            <p><strong>Nitrogen Level:</strong> {prediction.nitrogenLevel} kg/ha</p>
            <p><strong>Phosphorus Level:</strong> {prediction.phosphorusLevel} kg/ha</p>
            <p><strong>Potassium Level:</strong> {prediction.potassiumLevel} kg/ha</p>
            <p><strong>pH Level:</strong> {prediction.pHLevel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Estimated Yield:</strong> {prediction.yield} tons/acre</p>
            <p><strong>Suggested Fertilizers:</strong> {prediction.fertilizers.join(', ')}</p>
            <p><strong>Suggested Pesticides:</strong> {prediction.pesticides.join(', ')}</p>
            <p><strong>Potential Diseases:</strong> {prediction.diseases.join(', ')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Soil Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>pH Value:</strong> {prediction.soilRecommendations.pH}</p>
            <p><strong>Nitrogen:</strong> {prediction.soilRecommendations.nitrogen} kg/ha</p>
            <p><strong>Phosphorus:</strong> {prediction.soilRecommendations.phosphorus} kg/ha</p>
            <p><strong>Potassium:</strong> {prediction.soilRecommendations.potassium} kg/ha</p>
            <p><strong>Water Requirement:</strong> {prediction.soilRecommendations.water} mm</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <Button asChild>
          <Link href="/history">Back to History</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

