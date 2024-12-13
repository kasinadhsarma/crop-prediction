'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function PredictPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    acres: '',
    budget: '',
    soilType: '',
    cropType: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting:', formData)
    // For now, we'll just redirect to a mock results page
    router.push('/results')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Predict Your Crop Yield</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crop Yield Prediction</CardTitle>
          <CardDescription>Enter your field details to predict crop yield.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="acres">Total Area (in Acres)</Label>
              <Input
                id="acres"
                name="acres"
                type="number"
                required
                value={formData.acres}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500">The total area of your field in acres.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                required
                value={formData.budget}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500">Your total budget for this crop cycle.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select onValueChange={(value) => handleSelectChange('soilType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loam">Loam</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">The type of soil in your field.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Select onValueChange={(value) => handleSelectChange('cropType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">The type of crop you plan to grow.</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

