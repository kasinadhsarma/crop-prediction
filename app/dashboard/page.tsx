'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ModeToggle } from '@/components/mode-toggle'
import { BarChart, PieChart, Calendar, Sprout, Droplet, Tractor, CloudRain } from 'lucide-react'

export default function Dashboard() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)

  const handleModeChange = (isAdvanced: boolean) => {
    setIsAdvancedMode(isAdvanced)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Farmer&apos;s Dashboard</h1>
        <ModeToggle onModeChange={handleModeChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/predict">New Crop Prediction</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/history">View Prediction History</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Recent Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/results/1" className="text-green-600 hover:underline">
                  Wheat - June 1, 2023
                </Link>
              </li>
              <li>
                <Link href="/results/2" className="text-green-600 hover:underline">
                  Corn - June 15, 2023
                </Link>
              </li>
              <li>
                <Link href="/results/3" className="text-green-600 hover:underline">
                  Soybeans - July 1, 2023
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Weather Forecast</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CloudRain className="h-16 w-16 text-green-600 mb-2" />
            <p className="text-lg font-semibold">Partly Cloudy</p>
            <p>High: 75°F | Low: 60°F</p>
          </CardContent>
        </Card>
        {isAdvancedMode && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Yield Trends</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-40">
                <BarChart size={64} className="text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Crop Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-40">
                <PieChart size={64} className="text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Seasonal Planner</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-40">
                <Calendar size={64} className="text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Soil Health Monitor</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-40">
                <Sprout size={64} className="text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Water Management</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-40">
                <Droplet size={64} className="text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Equipment Status</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-40">
                <Tractor size={64} className="text-green-600" />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

