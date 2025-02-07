'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getSoilSuggestions } from '@/app/actions/getSoilSuggestions';

interface SoilSuggestionsProps {
  phValue: string;
}

export function SoilSuggestions({ phValue }: SoilSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const result = await getSoilSuggestions(phValue);
        setSuggestions(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [phValue]);

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Soil pH Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Soil pH Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Soil pH Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{suggestions}</p>
      </CardContent>
    </Card>
  );
}
