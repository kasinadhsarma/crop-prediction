'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, Sprout, Droplet, Sun, Wind, Leaf, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const handleModeChange = (isAdvanced: boolean) => {
    setIsAdvancedMode(isAdvanced);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800">Crop Yield Predictor</h1>
          <ModeToggle onModeChange={handleModeChange} />
        </div>

        <section className="mb-12">
          <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Revolutionize Your Farming</h2>
              <p className="text-lg sm:text-xl mb-4">Harness the power of AI to maximize your crop yields and optimize resource usage</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="secondary" className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-100">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 relative">
            <Image
            src="/images/farming.png"
            alt="Modern farmer using tablet with drone"
            width={400}
            height={300}
            className="rounded-lg shadow-lg w-full object-cover"
            priority
          />
              <div className="absolute top-0 right-0 bg-green-600 text-white p-2 rounded-bl-lg rounded-tr-lg text-sm">
                AI-Powered
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-green-800">Why Choose Crop Yield Predictor?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Zap className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-green-700">Precision Agriculture</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Leverage cutting-edge AI and machine learning to make data-driven decisions for your farm.</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Leaf className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-green-700">Sustainable Farming</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Optimize resource usage and reduce environmental impact while maximizing your crop yields.</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-green-700">Increased Profitability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Boost your farm&apos;s productivity and profitability with accurate yield predictions and recommendations.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {isAdvancedMode && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-800">Advanced Precision Farming Tools</h2>
            <Tabs defaultValue="yield-analysis" className="bg-white rounded-lg shadow-md p-6">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
                <TabsTrigger value="yield-analysis" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">Yield Analysis</TabsTrigger>
                <TabsTrigger value="soil-health" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">Soil Health</TabsTrigger>
                <TabsTrigger value="weather-impact" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">Weather Impact</TabsTrigger>
              </TabsList>
              <TabsContent value="yield-analysis">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">AI-Powered Yield Analysis</CardTitle>
                    <CardDescription>Unlock the full potential of your farmland</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <BarChart className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">Predictive Modeling</h3>
                        <p>Use machine learning algorithms to forecast crop yields with unprecedented accuracy.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <PieChart className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">Crop Rotation Optimizer</h3>
                        <p>Maximize long-term soil health and yields with AI-suggested crop rotation plans.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="soil-health">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Smart Soil Management</CardTitle>
                    <CardDescription>Optimize your soil for peak performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Sprout className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">Real-time Nutrient Tracking</h3>
                        <p>Monitor soil nutrients in real-time and receive AI-driven fertilization recommendations.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Droplet className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">Precision Irrigation</h3>
                        <p>Optimize water usage with AI-controlled irrigation systems based on soil moisture and weather forecasts.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="weather-impact">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Climate-Smart Farming</CardTitle>
                    <CardDescription>Stay ahead of weather challenges</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Sun className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">Microclimate Analysis</h3>
                        <p>Utilize IoT sensors and AI to analyze and optimize for microclimates within your fields.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Wind className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-700">Extreme Weather Preparedness</h3>
                        <p>Receive AI-generated action plans to protect your crops from upcoming extreme weather events.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-800">Join the Future of Farming</h2>
          <p className="mb-4 text-green-700">Experience the power of AI-driven agriculture and take your farm to the next level.</p>
          <Button asChild size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
            <Link href="/signup">Start Your Free Trial</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}