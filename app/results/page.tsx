// This is a client-side component
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultsClient from './results-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// The component handles URL search parameters containing JSON data
export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching from: ${API_URL}/predict_crop`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/predict_crop`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setInitialData(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  let parsedParams = null;
  
  // Attempts to parse the 'data' parameter from URL
  if (searchParams && searchParams.get('data')) {
    try {
      parsedParams = JSON.parse(searchParams.get('data') || '');
    } catch (e) {
      console.error('Error parsing searchParams.data:', e);
    }
  }
  
  // Passes parsed data to ResultsClient component
  return <ResultsClient initialData={initialData || parsedParams} />;
}