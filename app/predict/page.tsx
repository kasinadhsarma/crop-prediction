'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FormData {
  land: string;
  temperature: string;
  humidity: string;
  rainfall: string;
  soilType: string;
  budget: string;
  nitrogen?: string;
  phosphorus?: string;
  potassium?: string;
}

const RequiredLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <Label htmlFor={htmlFor} className="flex items-center gap-1 font-medium text-gray-700">
    {children}
    <span className="text-red-500">*</span>
  </Label>
);

export default function PredictPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    land: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    soilType: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const soilTypes = [
    "Clay",
    "Silt",
    "Sand",
    "Loam",
    "Clay_Silt",
    "Sandy_Loam",
    "Silt_Loam",
    "Clay_Loam",
    "Loamy_Sand",
  ];

  const validateField = (name: string, value: string): string | null => {
    const num = parseFloat(value);
    switch (name) {
      case 'land':
      case 'budget':
        return num < 0 ? `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative` : null;
      case 'temperature':
        return (num < -50 || num > 50) ? 'Temperature must be between -50 and 50' : null;
      case 'humidity':
        return (num < 0 || num > 100) ? 'Humidity must be between 0 and 100' : null;
      case 'rainfall':
        return num < 0 ? 'Rainfall cannot be negative' : null;
      case 'soilType':
        return value.trim() === '' ? 'Soil type is required' : null;
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const validationError = validateField(name, value);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const requestBody = {
      land: parseFloat(formData.land),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity),
      rainfall: parseFloat(formData.rainfall),
      budget: parseFloat(formData.budget),
      soil_type: formData.soilType,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_URL}/predict_crop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'your_api_key_here',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      router.push(`/results?data=${encodeURIComponent(JSON.stringify({ ...data, inputs: formData }))}`);
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        setError(error.name === 'AbortError' 
          ? 'Request timed out. Please try again.' 
          : `Error: ${error.message}`);
      } else {
        setError('Failed to connect to prediction service. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="max-w-md mx-auto mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Predict Your Crop Yield
          </h1>
          <Card className="max-w-2xl mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="space-y-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
              <CardTitle className="text-2xl font-bold text-gray-800">Crop Yield Prediction</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your field details to predict crop yield.
                <span className="text-red-500 text-sm ml-1">* Required fields</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ErrorBoundary>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {['land', 'temperature', 'humidity', 'rainfall', 'budget'].map((field) => (
                    <motion.div className="space-y-2" key={field}>
                      <RequiredLabel htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </RequiredLabel>
                      <Input
                        id={field}
                        name={field}
                        type="number"
                        required
                        value={formData[field as keyof FormData]}
                        onChange={handleChange}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-sm text-gray-500">
                        {field === 'land'
                          ? 'Enter the size of your land in acres.'
                          : field === 'budget'
                          ? 'Enter your budget in appropriate units.'
                          : `Enter the ${field} in the appropriate units.`}
                      </p>
                    </motion.div>
                  ))}

                  {/* Soil Type Select */}
                  <motion.div className="space-y-2">
                    <RequiredLabel htmlFor="soilType">Soil Type</RequiredLabel>
                    <Select
                      value={formData.soilType}
                      onValueChange={(value) => handleChange({ target: { name: 'soilType', value } } as React.ChangeEvent<HTMLSelectElement>)}
                    >
                      <SelectTrigger id="soilType" className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">Select the type of soil in your field.</p>
                  </motion.div>

                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                    Submit
                  </Button>
                </form>
              </ErrorBoundary>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
