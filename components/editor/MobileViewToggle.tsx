"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit3 } from "lucide-react";

interface MobileViewToggleProps {
    currentView: 'editor' | 'preview';
    onToggle: () => void;
}

export function MobileViewToggle({ currentView, onToggle }: MobileViewToggleProps) {
    return (
        <Button
            onClick={onToggle}
            size="lg"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl lg:hidden hover:scale-110 transition-transform duration-200"
            aria-label={currentView === 'editor' ? 'View Preview' : 'View Editor'}
            title={currentView === 'editor' ? 'View Preview' : 'View Editor'}
        >
            {currentView === 'editor' ? (
                <Eye className="h-6 w-6" />
            ) : (
                <Edit3 className="h-6 w-6" />
            )}
        </Button>
    );
}
