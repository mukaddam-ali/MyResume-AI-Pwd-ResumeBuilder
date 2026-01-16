
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { resumeData, jobDescription } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set in environment variables." },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            Act as a strict, professional Applicant Tracking System (ATS) and expert Resume Coach.
            Analyze the following resume JSON data against professional standards${jobDescription ? ' and the provided Job Description' : ''}.

            Resume Data:
            ${JSON.stringify(resumeData)}

            ${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}

            Provide a detailed analysis in the following JSON format ONLY:
            {
                "score": number (0-100),
                "category_scores": {
                    "impact": number (0-100, focus on metrics/results),
                    "brevity": number (0-100, conciseness),
                    "style": number (0-100, active verbs, professionalism),
                    "structure": number (0-100, completeness)
                },
                "keywords": {
                    "found": string[],
                    "missing": string[] (important keywords from JD or industry standards that are missing)
                },
                "feedback": [
                    "Detailed, actionable string 1",
                    "Detailed, actionable string 2"
                ],
                "red_flags": [
                    "Critical issue 1 (e.g., spelling errors, formatting issues)"
                ],
                "summary": "A brief 2-sentence professional summary of the resume's strength."
            }
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const response = await result.response;
        const text = response.text();
        const data = JSON.parse(text);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("ATS Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze resume." },
            { status: 500 }
        );
    }
}
