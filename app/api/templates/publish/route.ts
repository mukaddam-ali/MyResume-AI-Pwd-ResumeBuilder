import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';
import { ResumeData } from '@/store/useResumeStore';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient<Database>(supabaseUrl, supabaseKey);

        const { resumeId, resumeData, userId }: {
            resumeId: string;
            resumeData: ResumeData;
            userId: string;
        } = await request.json();

        if (!resumeId || !resumeData || !userId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Strip sensitive data before publishing
        const sanitizedData = {
            ...resumeData,
            photo: undefined, // Don't share photos
            analysisResult: null, // Don't share ATS analysis
            photoFilters: undefined
        };

        // Upsert (insert or update) the template
        const { error } = await supabase
            .from('public_templates')
            .upsert({
                resume_id: resumeId,
                user_id: userId,
                resume_data: sanitizedData,
                resume_name: resumeData.name,
                template_type: resumeData.selectedTemplate,
                job_title: resumeData.personalInfo?.jobTitle || null,
                updated_at: new Date().toISOString()
            } as any, {
                onConflict: 'resume_id'
            });

        if (error) {
            console.error('❌ Error publishing template:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        console.log('✅ Template published successfully:', resumeId);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Unexpected error in publish route:', error);
        console.error('Error stack:', (error as Error).stack);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
