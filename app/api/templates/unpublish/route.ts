import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function DELETE(request: NextRequest) {
    try {
        const supabase = createClient<Database>(supabaseUrl, supabaseKey);

        const { resumeId, userId }: { resumeId: string; userId: string } = await request.json();

        if (!resumeId || !userId) {
            return NextResponse.json(
                { success: false, error: 'Missing resumeId or userId' },
                { status: 400 }
            );
        }

        // Delete the template
        const { error } = await supabase
            .from('public_templates')
            .delete()
            .eq('resume_id', resumeId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error unpublishing template:', error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in unpublish route:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
