"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { ResumeDocument } from "./ResumeDocument";
import { ResumeData } from "@/store/useResumeStore";

interface DownloadResumeButtonProps {
    fileName?: string;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    data: ResumeData;
    size?: "default" | "sm" | "lg" | "icon";
}

export const DownloadResumeButton = ({
    fileName = "resume.pdf",
    className,
    variant = "outline",
    size = "default",
    data
}: DownloadResumeButtonProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        try {
            // Validate height (Strict Single Page Check)
            const previewContainer = document.getElementById('resume-preview');
            // The LiveResume component is the first child.
            // We measure the scrollHeight of the content.
            // A4 height at 96 DPI is approx 1123px. 
            // We allow a small buffer (e.g. 1130px) for sub-pixel rendering.
            if (previewContainer && previewContainer.firstElementChild) {
                const contentHeight = (previewContainer.firstElementChild as HTMLElement).scrollHeight;
                // Note: LiveResume typically applies a transform scale. 
                // offsetHeight/scrollHeight usually report the layout height (unscaled) if transform is on the element itself.
                // If the check fails, we assume overflow.
                if (contentHeight > 1135) {
                    alert("Resume exceeds one page. Please reduce content to fit on a single A4 page.");
                    return;
                }
            }

            setIsGenerating(true);

            // Generate PDF blob directly
            const blob = await pdf(<ResumeDocument data={data} userTier="pro" />).toBlob();

            // Create object URL and download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleDownload}
            disabled={isGenerating}
            title="Download PDF (Print)"
        >
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            {size !== "icon" && (isGenerating ? "Preparing..." : "Download PDF")}
        </Button>
    );
};
