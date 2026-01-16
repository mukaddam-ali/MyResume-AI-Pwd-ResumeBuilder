import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code && supabase) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to editor after successful authentication
    return NextResponse.redirect(new URL('/editor', request.url));
}
