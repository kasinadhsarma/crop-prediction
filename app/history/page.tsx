'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Mock data for past predictions
const mockPredictions = [
  { id: 1, date: '2023-06-01', crop: 'Wheat', yield: 3.8, acres: 100 },
  { id: 2, date: '2023-06-15', crop: 'Corn', yield: 9.2, acres: 150 },
  { id: 3, date: '2023-07-01', crop: 'Soybeans', yield: 2.9, acres: 80 },
  { id: 4, date: '2023-07-15', crop: 'Rice', yield: 4.1, acres: 120 },
]

export default function HistoryPage() {
  const [predictions] = useState(mockPredictions)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Prediction History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Past Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Yield (tons/acre)</TableHead>
                <TableHead>Acres</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction) => (
                <TableRow key={prediction.id}>
                  <TableCell>{prediction.date}</TableCell>
                  <TableCell>{prediction.crop}</TableCell>
                  <TableCell>{prediction.yield}</TableCell>
                  <TableCell>{prediction.acres}</TableCell>
                  <TableCell>
                    <Button asChild variant="link">
                      <Link href={`/results?id=${prediction.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-center">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

