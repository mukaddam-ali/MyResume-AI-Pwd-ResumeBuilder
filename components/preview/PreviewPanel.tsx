"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LiveResume } from "./LiveResume";
import { useSearchParams } from "next/navigation";
import { DownloadResumeButton } from "./DownloadResumeButton";

// Wrapper to handle SearchParams without Suspense boundary issues
const PaymentHandler = ({ setHasPaid }: { setHasPaid: (val: boolean) => void }) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            setHasPaid(true);
        }
    }, [searchParams, setHasPaid]);

    return null;
}

export function PreviewPanel() {
    const { resumes, activeResumeId, setContentScale } = useResumeStore();
    const activeResume = activeResumeId ? resumes[activeResumeId] : null;

    const [client, setClient] = useState(false);
    const [hasPaid, setHasPaid] = useState(true);
    const [loading, setLoading] = useState(false);
    const [scale, setScale] = useState(0.8);

    useEffect(() => {
        setClient(true);
        const handleResize = () => {
            const container = document.getElementById('preview-container');
            if (container) {
                const containerWidth = container.clientWidth;
                // 210mm is approx 794px.
                const targetScale = (containerWidth - 64) / 794; // 64px padding
                // Allow scale to go up to 5.0 for 4k/zoomed out screens
                setScale(Math.min(Math.max(targetScale, 0.4), 5.0));
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleUnlock = async () => {
        setLoading(true);
        try {
            // Call Stripe API
            const response = await fetch("/api/stripe/checkout_session", {
                method: "POST",
            });
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Payment initialization failed.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong with the payment mechanism.");
        } finally {
            setLoading(false);
        }
    };

    if (!client) return null;

    if (!activeResume) {
        return (
            <div className="flex h-full items-center justify-center bg-muted/30 text-muted-foreground">
                <div className="text-center p-6">
                    <p>No resume selected.</p>
                    <p className="text-sm">Create or select one to see preview.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-950 border-l dark:border-slate-800 relative">
            {/* Search Params Listener */}
            <React.Suspense fallback={null}>
                <PaymentHandler setHasPaid={setHasPaid} />
            </React.Suspense>

            {/* Header */}
            <div className="py-4 pl-4 pr-0 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-slate-700 dark:text-slate-200">Live Preview</h2>
                    {activeResume && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Size</span>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.1"
                                value={activeResume.contentScale || 1}
                                onChange={(e) => setContentScale(parseFloat(e.target.value))}
                                className="w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-blue-600"
                            />
                            <span className="text-xs font-mono w-8 text-right text-slate-600 dark:text-slate-300">
                                {Math.round((activeResume.contentScale || 1) * 100)}%
                            </span>
                        </div>
                    )}
                </div>
                {!hasPaid ? (
                    <Button
                        size="sm"
                        onClick={handleUnlock}
                        disabled={loading}
                        className="bg-texastech-red hover:bg-texastech-red/90 text-white gap-2 shadow-sm"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                        Unlock Download ($9)
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <DownloadResumeButton
                            key={activeResume.lastModified}
                            fileName={`${activeResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
                            data={activeResume}
                        />
                    </div>
                )}
            </div>

            <div id="preview-container" className="flex-1 overflow-y-auto overflow-x-hidden p-8 flex justify-center items-start scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 relative group bg-slate-100 dark:bg-zinc-950/50">
                {/* Watermark Overlay */}
                {!hasPaid && (
                    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-[0.05] select-none overflow-hidden mix-blend-multiply dark:mix-blend-screen">
                        <div className="rotate-[-45deg] text-[120px] font-black uppercase whitespace-nowrap text-slate-900 dark:text-slate-400">
                            LONE STAR RESUME
                        </div>
                    </div>
                )}

                {/* HTML Resume Component */}
                <div id="resume-preview" style={{
                    width: `${794 * scale}px`,
                    height: `${1123 * scale}px`,
                    flexShrink: 0
                }}>
                    <LiveResume data={activeResume} scale={scale} />
                </div>
            </div>
        </div >
    );
}
