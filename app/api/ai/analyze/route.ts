import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { resumeData, jobDescription } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set in environment variables." },
                { status: 500 }
            );
        }

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const result = await generateObject({
            model: google("gemini-2.0-flash"),
            schema: z.object({
                score: z.number().min(0).max(100),
                category_scores: z.object({
                    impact: z.number().min(0).max(100),
                    brevity: z.number().min(0).max(100),
                    style: z.number().min(0).max(100),
                    structure: z.number().min(0).max(100),
                }),
                keywords: z.object({
                    found: z.array(z.string()),
                    missing: z.array(z.string()),
                }),
                feedback: z.array(z.string()),
                red_flags: z.array(z.string()),
                summary: z.string(),
            }),
            prompt: `
            Act as a strict, professional Applicant Tracking System (ATS) and expert Resume Coach.
            Analyze the following resume JSON data against professional standards${jobDescription ? ' and the provided Job Description' : ''}.

            Resume Data:
            ${JSON.stringify(resumeData)}

            ${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}

            Provide a detailed analysis.
            `,
        });

        return NextResponse.json(result.object);

    } catch (error: any) {
        console.error("ATS Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze resume." },
            { status: 500 }
        );
    }
}
