"use client";

import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FONT_OPTIONS = [
    { id: 'inter', name: 'Inter (Default)', family: 'Inter, sans-serif', premium: false },
    { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif', premium: false },
    { id: 'open-sans', name: 'Open Sans', family: '"Open Sans", sans-serif', premium: false },
    { id: 'lato', name: 'Lato', family: 'Lato, sans-serif', premium: false },
    { id: 'montserrat', name: 'Montserrat', family: 'Montserrat, sans-serif', premium: false },
    { id: 'poppins', name: 'Poppins', family: 'Poppins, sans-serif', premium: true },
    { id: 'source-sans', name: 'Source Sans', family: '"Source Sans 3", sans-serif', premium: false },
    { id: 'lora', name: 'Lora (Serif)', family: 'Lora, serif', premium: true },
    { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display, serif', premium: true },
    { id: 'oswald', name: 'Oswald', family: 'Oswald, sans-serif', premium: true },
    { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, serif', premium: true },
    { id: 'jetbrains', name: 'JetBrains Mono', family: 'JetBrains Mono, monospace', premium: true },
];

export function FontSelector() {
    const { resumes, activeResumeId, setFontFamily, userTier } = useResumeStore();
    const activeResume = activeResumeId ? resumes[activeResumeId] : null;
    const currentFont = activeResume?.fontFamily || 'inter';

    const handleFontChange = (value: string) => {
        const font = FONT_OPTIONS.find(f => f.id === value);
        if (font?.premium && userTier === 'free') {
            alert("This is a Premium Font. Upgrade to Pro to use it.");
            return;
        }
        setFontFamily(value);
    };

    return (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400">
                    <Type className="h-4 w-4" />
                </div>
                <div>
                    <Label className="text-sm font-semibold">Typography</Label>
                    <p className="text-xs text-muted-foreground">Select font style</p>
                </div>
            </div>

            <Select value={currentFont} onValueChange={handleFontChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Font" />
                </SelectTrigger>
                <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                        <SelectItem
                            key={font.id}
                            value={font.id}
                            disabled={font.premium && userTier === 'free'}
                            className="font-sans"
                        >
                            <div className="flex items-center justify-between w-full min-w-[200px]">
                                <span style={{ fontFamily: font.family }}>{font.name}</span>
                                {font.premium && <Crown className="w-3 h-3 text-yellow-500 ml-2" />}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
