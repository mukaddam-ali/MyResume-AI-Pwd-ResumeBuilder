"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AutoSaveHandler } from "@/components/editor/AutoSaveHandler";

export default function EditorPage() {
    const { resumes, activeResumeId, addResume, setActiveResume } = useResumeStore();
    const router = useRouter();

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

    return (
        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
            <AutoSaveHandler />
            {/* Left Panel - Editor */}
            <div className="w-full lg:w-1/2 h-[600px] lg:h-full overflow-hidden border-r bg-background">
                <EditorPanel />
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full lg:w-1/2 h-[600px] lg:h-full bg-muted/30">
                <PreviewPanel />
            </div>
        </div>
    );
}
