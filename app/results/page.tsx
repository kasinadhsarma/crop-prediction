'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Results() {
  const searchParams = useSearchParams()
  const data = JSON.parse(decodeURIComponent(searchParams.get('data') || '{}'))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crop Yield Prediction Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crop Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Suggested Crop:</strong> {data.cropType}</p>
            <p><strong>Suggested Fertilizers:</strong> {data.fertilizers.join(', ')}</p>
            <p><strong>Suggested Pesticides:</strong> {data.pesticides.join(', ')}</p>
            <p><strong>Potential Diseases:</strong> {data.diseases.join(', ')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Soil Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>pH Value:</strong> {data.soilRecommendations.pH}</p>
            <p><strong>Nitrogen:</strong> {data.soilRecommendations.nitrogen} kg/ha</p>
            <p><strong>Phosphorus:</strong> {data.soilRecommendations.phosphorus} kg/ha</p>
            <p><strong>Potassium:</strong> {data.soilRecommendations.potassium} kg/ha</p>
            <p><strong>Water Requirement:</strong> {data.soilRecommendations.water} mm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Yield Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Estimated Yield:</strong> {data.yield} tons/acre</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-center">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

