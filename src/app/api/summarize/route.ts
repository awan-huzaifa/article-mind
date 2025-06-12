import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getPromptForType = (type: string, content: string) => {
  const prompts = {
    concise: ` You are given html content as article. Please provide a single, clear summary paragraph of this article. Focus on the main points and keep it concise and in your output dont mention that you were given html content: ${content}`,
    
    bullet: `You are given html content as article. Please provide 5-7 key bullet points summarizing the main takeaways from this article and in your output dont mention that you were given html content: ${content}`,
    
    eli5: `You are given html content as article. Please explain this article in simple terms, as if explaining it to a 5-year-old. Use basic language and avoid complex terms and in your output dont mention that you were given html content: ${content}`,
    
    executive: `You are given html content as article. Please provide an executive summary of this article. Focus on high-level insights, key findings, and business implications and in your output dont mention that you were given html content: ${content}`,
    
    detailed: `You are given html content as article. Please provide a detailed breakdown of this article with the following structure:
    1. Introduction: Main topic and context
    2. Body: Key points and supporting details
    3. Conclusion: Main takeaways and implications
    In your output dont mention that you were given html content
    Article: ${content}`,
    
    proscons: `You are given html content as article. Please analyze this article and provide a list of pros and cons, advantages and disadvantages, or positive and negative aspects and in your output dont mention that you were given html content: ${content}`,
    
    facts: `You are given html content as article. Please extract only the key facts, statistics, and numerical data that is related to this article. Focus on verifiable information and in your output dont mention that you were given html content: ${content}`
  };

  return prompts[type as keyof typeof prompts] || prompts.concise;
};

export async function POST(req: Request) {
  try {
    const { url, summaryType } = await req.json();

    // Fetch the article content from the URL
    const response = await fetch(url);
    const html = await response.text();

    // Get summary using Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes articles in various formats. Provide clear, accurate, and well-structured summaries."
        },
        {
          role: "user",
          content: getPromptForType(summaryType, html)
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000
    });

    const summary = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize article' },
      { status: 500 }
    );
  }
} 
