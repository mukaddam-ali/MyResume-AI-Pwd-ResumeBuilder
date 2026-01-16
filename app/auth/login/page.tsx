"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const { user, signInWithGoogle, loading } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (user && !loading) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC5500]"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-6"
            >
                <div className="bg-card border rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome to MyResume</h1>
                        <p className="text-muted-foreground">
                            Sign in to save and sync your resumes across devices
                        </p>
                    </div>

                    {/* Sign in with Google */}
                    <div className="space-y-4">
                        <Button
                            onClick={signInWithGoogle}
                            size="lg"
                            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm font-medium"
                        >
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <Link href="/editor">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full h-12 font-medium"
                            >
                                Continue as Guest
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-center text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>

                {/* Benefits */}
                <div className="mt-8 space-y-3">
                    <p className="text-sm font-semibold text-center text-muted-foreground">
                        Why sign in?
                    </p>
                    <div className="grid gap-2">
                        {[
                            '☁️ Sync resumes across all devices',
                            '💾 Never lose your work',
                            '🚀 Access from anywhere',
                        ].map((benefit) => (
                            <div
                                key={benefit}
                                className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2"
                            >
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
