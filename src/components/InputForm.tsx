"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Briefcase, Zap } from "lucide-react";

interface InputFormProps {
  onSubmit: (resume: string, jd: string) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim() || !jd.trim()) {
      setError("Please provide both your resume and the job description.");
      return;
    }
    setError("");
    onSubmit(resume, jd);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid-2">
        <div className="input-group">
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} />
            Your Resume
          </label>
          <textarea 
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here..."
            disabled={isLoading}
          />
        </div>
        
        <div className="input-group">
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} />
            Job Description
          </label>
          <textarea 
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here..."
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: 'var(--missing-color)', marginBottom: '1rem', fontSize: '0.875rem' }}
        >
          {error}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading || !resume.trim() || !jd.trim()}
        >
          <Zap size={18} />
          {isLoading ? "Analyzing..." : "Compare & Analyze"}
        </button>
      </div>
    </motion.form>
  );
}
