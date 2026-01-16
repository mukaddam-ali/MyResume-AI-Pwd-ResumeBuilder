"use client";

import { PDFViewer } from "@react-pdf/renderer";
import React from "react";

interface PDFViewerWrapperProps {
    className?: string;
    showToolbar?: boolean;
    children: React.ReactElement;
}

const PDFViewerWrapper = ({ className, showToolbar, children }: PDFViewerWrapperProps) => {
    return (
        <PDFViewer className={className} showToolbar={showToolbar}>
            {children}
        </PDFViewer>
    );
};

export default PDFViewerWrapper;
