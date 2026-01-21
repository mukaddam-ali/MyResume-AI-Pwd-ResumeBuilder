"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { MobileViewToggle } from "@/components/editor/MobileViewToggle";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AutoSaveHandler } from "@/components/editor/AutoSaveHandler";

export default function EditorPage() {
    const { resumes, activeResumeId, addResume, setActiveResume } = useResumeStore();
    const router = useRouter();
    const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

    useEffect(() => {
        // If store is not hydrated yet, wait (if we had a hydration flag). 
        // Assuming persist works reasonably fast.

        // Use a timeout to allow hydration
        const timer = setTimeout(() => {
            if (activeResumeId) return;

            const resumeIds = Object.keys(resumes);
            if (resumeIds.length > 0) {
                setActiveResume(resumeIds[0]);
            } else {
                addResume("My First Resume");
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [resumes, activeResumeId, addResume, setActiveResume]);

    const toggleMobileView = () => {
        setMobileView(prev => prev === 'editor' ? 'preview' : 'editor');
    };

    return (
        <div className="flex flex-col lg:flex-row flex-1 min-h-screen">
            <AutoSaveHandler />

            {/* Left Panel - Editor */}
            <div className={`w-full lg:w-1/2 bg-background ${mobileView === 'preview' ? 'hidden lg:block' : ''}`}>
                <EditorPanel />
            </div>

            {/* Right Panel - Preview */}
            <div className={`w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen overflow-hidden ${mobileView === 'editor' ? 'hidden lg:block' : ''}`}>
                <PreviewPanel />
            </div>

            {/* Mobile View Toggle FAB */}
            <MobileViewToggle currentView={mobileView} onToggle={toggleMobileView} />
        </div>
    );
}
