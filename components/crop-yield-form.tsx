'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface CropYieldFormProps {
  isAdvancedMode: boolean
}

export function CropYieldForm({ isAdvancedMode }: CropYieldFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    acres: '',
    costs: '',
    soilType: '',
    cropType: '',
    nitrogenLevel: 50,
    phosphorusLevel: 50,
    potassiumLevel: 50,
    pHLevel: 7,
    rainfall: '',
    temperature: '',
    humidity: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        const data = await response.json()
        router.push(`/results?data=${encodeURIComponent(JSON.stringify(data))}`)
      } else {
        console.error('Failed to fetch prediction')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="acres">Acres</Label>
        <Input
          id="acres"
          name="acres"
          type="number"
          required
          value={formData.acres}
          onChange={handleChange}
        />
      </div>
      {isAdvancedMode && (
        <div>
          <Label htmlFor="costs">Costs</Label>
          <Input
            id="costs"
            name="costs"
            type="number"
            required
            value={formData.costs}
            onChange={handleChange}
          />
        </div>
      )}
      <div>
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
      </div>
      <div>
        <Label htmlFor="cropType">Crop Type</Label>
        <Select onValueChange={(value) => handleSelectChange('cropType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select crop type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wheat">Wheat</SelectItem>
            <SelectItem value="rice">Rice</SelectItem>
            <SelectItem value="corn">Corn</SelectItem>
            <SelectItem value="soybeans">Soybeans</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isAdvancedMode && (
        <>
          <div>
            <Label htmlFor="nitrogenLevel">Nitrogen Level</Label>
            <Slider
              id="nitrogenLevel"
              min={0}
              max={100}
              step={1}
              value={[formData.nitrogenLevel]}
              onValueChange={(value) => handleSliderChange('nitrogenLevel', value)}
            />
            <span className="text-sm text-gray-500">{formData.nitrogenLevel} kg/ha</span>
          </div>
          <div>
            <Label htmlFor="phosphorusLevel">Phosphorus Level</Label>
            <Slider
              id="phosphorusLevel"
              min={0}
              max={100}
              step={1}
              value={[formData.phosphorusLevel]}
              onValueChange={(value) => handleSliderChange('phosphorusLevel', value)}
            />
            <span className="text-sm text-gray-500">{formData.phosphorusLevel} kg/ha</span>
          </div>
          <div>
            <Label htmlFor="potassiumLevel">Potassium Level</Label>
            <Slider
              id="potassiumLevel"
              min={0}
              max={100}
              step={1}
              value={[formData.potassiumLevel]}
              onValueChange={(value) => handleSliderChange('potassiumLevel', value)}
            />
            <span className="text-sm text-gray-500">{formData.potassiumLevel} kg/ha</span>
          </div>
          <div>
            <Label htmlFor="pHLevel">pH Level</Label>
            <Slider
              id="pHLevel"
              min={0}
              max={14}
              step={0.1}
              value={[formData.pHLevel]}
              onValueChange={(value) => handleSliderChange('pHLevel', value)}
            />
            <span className="text-sm text-gray-500">{formData.pHLevel}</span>
          </div>
          <div>
            <Label htmlFor="rainfall">Average Annual Rainfall (mm)</Label>
            <Input
              id="rainfall"
              name="rainfall"
              type="number"
              value={formData.rainfall}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="temperature">Average Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              value={formData.temperature}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="humidity">Average Humidity (%)</Label>
            <Input
              id="humidity"
              name="humidity"
              type="number"
              value={formData.humidity}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      <Button type="submit" className="w-full">Predict Yield</Button>
    </form>
  )
}

