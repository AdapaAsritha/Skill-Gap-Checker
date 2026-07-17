"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

export interface AnalysisResult {
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  recommendation: string;
}

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Animate percentage from 0 to actual value
    const duration = 1500; // ms
    const steps = 60;
    const stepTime = duration / steps;
    const stepValue = result.matchPercentage / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= result.matchPercentage) {
        setAnimatedPercentage(result.matchPercentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result.matchPercentage]);

  const circleCircumference = 2 * Math.PI * 60;
  const strokeDashoffset = circleCircumference - (animatedPercentage / 100) * circleCircumference;

  return (
    <motion.div 
      className="glass-panel animate-slide-up"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="gradient-text">Analysis Complete</h2>
        
        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '2rem 0' }}>
          {/* Background Circle */}
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            <circle 
              cx="80" 
              cy="80" 
              r="60" 
              fill="transparent" 
              stroke="var(--surface-border)" 
              strokeWidth="12" 
            />
            {/* Progress Circle */}
            <circle 
              cx="80" 
              cy="80" 
              r="60" 
              fill="transparent" 
              stroke="var(--accent-primary)" 
              strokeWidth="12" 
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white' }}>
              {animatedPercentage}%
            </span>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>Overall Match Score</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--match-color)', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} />
            Matched Skills ({result.matchedSkills.length})
          </h3>
          <div className="chip-container">
            {result.matchedSkills.length > 0 ? (
              result.matchedSkills.map(skill => (
                <span key={skill} className="chip match">{skill}</span>
              ))
            ) : (
              <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No matching skills found.</span>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--missing-color)', marginBottom: '1rem' }}>
            <XCircle size={20} />
            Missing Skills ({result.missingSkills.length})
          </h3>
          <div className="chip-container">
            {result.missingSkills.length > 0 ? (
              result.missingSkills.map(skill => (
                <span key={skill} className="chip missing">{skill}</span>
              ))
            ) : (
              <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Perfect match! No missing skills.</span>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
          <Lightbulb size={20} />
          Recommendation
        </h3>
        <p style={{ color: 'var(--text-primary)' }}>{result.recommendation}</p>
      </div>
    </motion.div>
  );
}
