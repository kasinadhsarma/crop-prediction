import ResultsClient from './results-client';

// app/results/page.tsx
export default function ResultsPage({
  searchParams,
}: {
  searchParams: { data?: string };
}) {
  // Remove async since we're not using await
  return <ResultsClient searchParams={searchParams} />;
}