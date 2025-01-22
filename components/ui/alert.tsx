'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

// Error rendering component
const ErrorAlert = ({ 
  error, 
  onRetry 
}: { 
  error: string;
  onRetry: () => void;
}) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-red-500">
      <CardHeader className="bg-red-50 flex flex-row items-center space-x-2">
        <AlertCircle className="text-red-500 mr-2" />
        <CardTitle className="text-red-700">Prediction Error</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 text-red-600">
          {error}
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Possible Reasons:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Extreme environmental conditions</li>
            <li>Measurement errors</li>
            <li>Insufficient data for prediction</li>
          </ul>
        </div>
        
        <Button 
          onClick={onRetry} 
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorAlert;