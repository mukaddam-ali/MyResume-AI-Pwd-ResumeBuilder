"use client";
import React from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

import { SectionScaleControl } from "../SectionScaleControl";

export function SkillsForm() {
    const { resumes, activeResumeId, setSkills } = useResumeStore();
    const activeResume = activeResumeId ? resumes[activeResumeId] : null;

    // Parse initial skills from string to array
    const [input, setInput] = React.useState("");
    const [showDropdown, setShowDropdown] = React.useState(false);

    // Get skills as array, filtering empty strings
    const currentSkills = React.useMemo(() => {
        if (!activeResume?.skills) return [];
        return activeResume.skills.split(',').map(s => s.trim()).filter(Boolean);
    }, [activeResume?.skills]);

    const handleAddSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (!trimmed || currentSkills.includes(trimmed)) {
            setInput("");
            setShowDropdown(false);
            return;
        }
        const newSkills = [...currentSkills, trimmed].join(', ');
        setSkills(newSkills);
        setInput("");
        setShowDropdown(false);
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        const newSkills = currentSkills.filter(s => s !== skillToRemove).join(', ');
        setSkills(newSkills);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill(input);
        }
    };

    // Filter popular skills
    const filteredSuggestions = POPULAR_SKILLS.filter(
        skill =>
            skill.toLowerCase().includes(input.toLowerCase()) &&
            !currentSkills.includes(skill)
    ).slice(0, 10); // Limit to top 10

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills</h2>

            <SectionScaleControl sectionId="skills" />

            {/* Input Area */}
            <div className="space-y-3">
                <Label>Add Skills</Label>
                <div className="relative">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setShowDropdown(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click
                            placeholder="Type a skill (e.g. React, Leadership)..."
                            className="flex-1"
                        />
                        <Button
                            onClick={() => handleAddSkill(input)}
                            disabled={!input.trim()}
                            size="icon"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showDropdown && input && filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <ul className="py-1">
                                {filteredSuggestions.map(skill => (
                                    <li
                                        key={skill}
                                        onClick={() => handleAddSkill(skill)}
                                        className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-2"
                                    >
                                        <Plus className="h-3 w-3 opacity-50" />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Selected Skills Tags */}
                <div className="flex flex-wrap gap-2 min-h-[40px] p-1">
                    {currentSkills.length === 0 && (
                        <span className="text-sm text-muted-foreground italic">No skills added yet.</span>
                    )}
                    {currentSkills.map((skill, i) => (
                        <div
                            key={i}
                            className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 group"
                        >
                            {skill}
                            <button
                                onClick={() => handleRemoveSkill(skill)}
                                className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors ml-1"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                Tip: Press Enter to add a custom skill.
            </p>
        </div>
    );
}

const POPULAR_SKILLS = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "C++", "C#",
    "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD",
    "HTML5", "CSS3", "Tailwind CSS", "Sass", "Redux", "GraphQL", "REST API",
    "Agile", "Scrum", "Project Management", "Communication", "Leadership", "Problem Solving",
    "Figma", "Adobe XD", "UI/UX Design", "Machine Learning", "Data Analysis", "Go", "Rust",
    "Flutter", "React Native", "Swift", "Kotlin", "Firebase", "Azure", "Google Cloud",
    "Linux", "Cybersecurity", "Testing", "Jest", "Cypress", "SEO", "Performance Optimization"
];
