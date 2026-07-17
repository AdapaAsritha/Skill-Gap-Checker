import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { resume, jd } = await req.json();

    if (!resume || !jd) {
      return NextResponse.json({ error: "Missing resume or job description" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Server Configuration Error: GEMINI_API_KEY is not set in the environment variables." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are a strict JSON API that extracts skills from text. 
Extract technical skills, tools, frameworks, languages, and relevant soft skills. 
Normalize the terms (e.g., trim whitespace, standard casing, treat "ReactJS" and "React" as equivalent - prefer standard names like "React").`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "List of extracted skills"
        }
      },
      required: ["skills"]
    };

    const extractSkills = async (text: string) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Extract the skills from the following text:\n\n${text}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.1,
        }
      });

      const content = response.text;
      
      try {
        const parsed = JSON.parse(content || "{}");
        return Array.isArray(parsed.skills) ? parsed.skills.map((s: string) => s.toLowerCase().trim()) : [];
      } catch (e) {
        console.error("Failed to parse LLM output:", content);
        throw new Error("Failed to parse skills from AI response");
      }
    };

    // Run extractions in parallel
    const [resumeSkills, jdSkills] = await Promise.all([
      extractSkills(resume),
      extractSkills(jd)
    ]);

    // Comparison Logic
    const resumeSet = new Set(resumeSkills);
    const jdSet = new Set(jdSkills);

    const matchedSkills = Array.from(jdSet).filter(skill => resumeSet.has(skill));
    const missingSkills = Array.from(jdSet).filter(skill => !resumeSet.has(skill));
    
    // Capitalize for display
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const displayMatched = matchedSkills.map(capitalize);
    const displayMissing = missingSkills.map(capitalize);

    const totalJdSkills = jdSkills.length;
    const matchPercentage = totalJdSkills > 0 
      ? Math.round((matchedSkills.length / totalJdSkills) * 100) 
      : 0;

    let recommendation = "";
    if (matchPercentage === 100) {
      recommendation = "Incredible match! Your resume aligns perfectly with the job description. You should definitely apply.";
    } else if (matchPercentage >= 70) {
      recommendation = `Great match! You have most of the required skills. Consider brushing up on or mentioning your experience with ${displayMissing.slice(0, 3).join(', ')} before applying.`;
    } else if (matchPercentage >= 40) {
      recommendation = `Moderate match. While you have some core skills, there is a gap. Focus on learning or highlighting ${displayMissing.slice(0, 3).join(', ')} to strengthen your application.`;
    } else {
      recommendation = `Low match. This role requires several skills you haven't listed. If you're passionate about this path, focus heavily on acquiring skills like ${displayMissing.slice(0, 3).join(', ')}.`;
    }

    return NextResponse.json({
      matchedSkills: displayMatched,
      missingSkills: displayMissing,
      matchPercentage,
      recommendation
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred during analysis." 
    }, { status: 500 });
  }
}
