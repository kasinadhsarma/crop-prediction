import ResultsClient from './results-client';

// app/results/page.tsx
export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  // Parse searchParams before passing to client component
  const parsedParams = searchParams?.data ? JSON.parse(searchParams.data) : null;
  
  return <ResultsClient initialData={parsedParams} />;
}