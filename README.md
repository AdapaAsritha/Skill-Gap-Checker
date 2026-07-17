# Skill Gap Checker

Instantly compare your resume against any job description to discover matching skills and identify critical gaps. This application leverages the Google Gemini AI to analyze text, extract key technical and soft skills, and provide a match percentage along with actionable recommendations.

## Tech Stack

- **Next.js** (App Router)
- **React 19**
- **Google Gemini API** (`@google/genai`)
- **Framer Motion** (for UI animations)
- **Lucide React** (for icons)

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory of the project and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com).*

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Assumptions

- **Equal Weighting of Skills**: The match score is calculated by dividing the number of matched skills by the total number of skills extracted from the job description. This assumes all skills mentioned in the JD hold equal weight.
- **LLM Normalization**: The matching algorithm assumes that the Gemini AI model can effectively normalize and standardize skills (e.g., treating "ReactJS" and "React" as the same entity) as requested in its system prompt.
- **Input Completeness**: The analysis assumes that the pasted resume and job description text contain all necessary information for a fair comparison without requiring OCR or complex document parsing.

## Trade-offs Made

- **Exact String Matching vs. Semantic Matching**: To determine the overlap between the resume and JD, the backend performs a simple set intersection on the lowercased strings returned by the AI. This is fast, stateless, and predictable, but trades off the nuance of semantic matching (such as using vector embeddings), which might be better at handling un-normalized synonyms.
- **Speed vs. Deep Reasoning**: The application uses the `gemini-2.5-flash` model. This trades off some absolute reasoning depth for significantly lower latency and cost, which is crucial for providing a snappy, real-time user experience in a web application.
- **Parallel AI Requests**: The extraction processes for the resume and the job description are run simultaneously using `Promise.all`. While this cuts the total response time in half, it consumes two concurrent requests to the LLM API per user action.
- **Simple HTTP Request vs. Streaming**: The application relies on a single `POST` request to receive the full JSON payload. This keeps the architecture simple and easy to maintain, trading off the perceived performance benefits of streaming the response chunk-by-chunk to the UI.
