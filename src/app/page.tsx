"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import LoadingIndicator from "@/components/LoadingIndicator";
import ResultsDisplay, { AnalysisResult } from "@/components/ResultsDisplay";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (resume: string, jd: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze skills");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text">Skill Gap Checker</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
          Instantly compare your resume against any job description to discover matching skills and identify critical gaps.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <InputForm onSubmit={handleAnalyze} isLoading={isLoading} />
        
        {error && (
          <div className="glass-panel" style={{ color: 'var(--missing-color)', border: '1px solid var(--missing-border)', background: 'var(--missing-bg)' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {isLoading && <LoadingIndicator />}
        
        {!isLoading && result && <ResultsDisplay result={result} />}
      </div>
    </main>
  );
}
