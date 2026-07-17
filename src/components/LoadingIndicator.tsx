"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <motion.div 
      className="glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}
      >
        <Sparkles size={48} />
      </motion.div>
      <motion.h2 
        className="gradient-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        Analyzing Skills
      </motion.h2>
      <p style={{ marginTop: '0.5rem', maxWidth: '300px' }}>
        Our AI is reading your resume and the job description to find the perfect match...
      </p>
    </motion.div>
  );
}
