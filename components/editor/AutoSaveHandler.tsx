"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useResumeStore } from "@/store/useResumeStore";

const AUTOSAVE_DELAY = 3000; // 3 seconds debounce

export function AutoSaveHandler() {
    const { user } = useAuth();
    const { syncStatus, setSyncStatus, syncToCloud, activeResumeId, resumes } = useResumeStore();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFirstRender = useRef(true);

    // Watch for changes in the active resume
    const activeResume = activeResumeId ? resumes[activeResumeId] : null;

    useEffect(() => {
        // Skip first render to prevent checking on mount
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!user || !activeResume) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set status to syncing (or 'unsaved' state could be added)
        // For now, we'll just trigger the sync after delay
        if (syncStatus === 'synced' || syncStatus === 'error') {
            setSyncStatus('idle'); // Indicate changes are pending
        }

        // Debounce sync
        timeoutRef.current = setTimeout(() => {
            syncToCloud(user.id);
        }, AUTOSAVE_DELAY);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [activeResume, user, syncToCloud, setSyncStatus]);

    return null;
}
