"use client";
import React from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { SectionScaleControl } from "../SectionScaleControl";

export function PersonalInfoForm() {
    const { resumes, activeResumeId, setPersonalInfo } = useResumeStore();
    const activeResume = activeResumeId ? resumes[activeResumeId] : null;
    const personalInfo = activeResume?.personalInfo || {
        fullName: '', jobTitle: '', email: '', phone: '', location: '',
        linkedin: '', website: '', github: '', summary: ''
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPersonalInfo({ [name]: value });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>

            <SectionScaleControl sectionId="personal" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={personalInfo.fullName} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" name="jobTitle" value={personalInfo.jobTitle || ''} onChange={handleChange} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={personalInfo.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={personalInfo.phone} onChange={handleChange} placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={personalInfo.location} onChange={handleChange} placeholder="Austin, TX" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" name="linkedin" value={personalInfo.linkedin} onChange={handleChange} placeholder="linkedin.com/in/john" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" name="github" value={personalInfo.github} onChange={handleChange} placeholder="github.com/john" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Website / Portfolio</Label>
                    <Input id="website" name="website" value={personalInfo.website} onChange={handleChange} placeholder="johndoe.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea id="summary" name="summary" value={personalInfo.summary} onChange={handleChange} placeholder="Brief summary for your resume..." className="min-h-[100px]" />
                </div>



                {/* Only show Photo Upload for templates that support it */}
                {['executive', 'designer', 'corporate'].includes(activeResume?.selectedTemplate || '') && (
                    <div className="md:col-span-2 space-y-4 border-t pt-4 mt-2">
                        <h3 className="font-semibold text-sm">Profile Picture</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                {personalInfo.photo ? (
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                                        <img
                                            src={personalInfo.photo}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            style={{
                                                filter: `brightness(${personalInfo.photoFilters?.brightness || 1}) contrast(${personalInfo.photoFilters?.contrast || 1}) grayscale(${personalInfo.photoFilters?.grayscale || 0})`,
                                                transform: `scale(${personalInfo.photoFilters?.scale || 1})`
                                            }}
                                        />
                                        <button
                                            onClick={() => setPersonalInfo({ photo: undefined })}
                                            className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 flex items-center justify-center text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs text-center p-2">
                                        No Photo
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Label htmlFor="photo-upload" className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                                        Upload Photo
                                    </Label>
                                    <Input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert("Image size should be less than 2MB");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPersonalInfo({
                                                        photo: reader.result as string,
                                                        photoFilters: {
                                                            scale: 1,
                                                            brightness: 1,
                                                            contrast: 1,
                                                            grayscale: 0
                                                        }
                                                    });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Recommended: Square JPG/PNG, max 2MB.</p>
                                </div>
                            </div>

                            {personalInfo.photo && (
                                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-md">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <Label>Zoom</Label>
                                            <span className="text-muted-foreground">{personalInfo.photoFilters?.scale || 1}x</span>
                                        </div>
                                        <Input
                                            type="range"
                                            min="1"
                                            max="3"
                                            step="0.1"
                                            value={personalInfo.photoFilters?.scale || 1}
                                            onChange={(e) => setPersonalInfo({
                                                photoFilters: { ...personalInfo.photoFilters!, scale: parseFloat(e.target.value) }
                                            })}
                                            className="h-6"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <Label>Grayscale</Label>
                                            <span className="text-muted-foreground">{Math.round((personalInfo.photoFilters?.grayscale || 0) * 100)}%</span>
                                        </div>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={personalInfo.photoFilters?.grayscale || 0}
                                            onChange={(e) => setPersonalInfo({
                                                photoFilters: { ...personalInfo.photoFilters!, grayscale: parseFloat(e.target.value) }
                                            })}
                                            className="h-6"
                                        />
                                    </div>

                                    <div className="col-span-2 space-y-3 border-t pt-2 mt-1">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="show-border" className="text-sm">Show Border</Label>
                                            <Switch
                                                id="show-border"
                                                checked={(personalInfo.photoFilters?.borderWidth || 0) > 0}
                                                onCheckedChange={(checked) => setPersonalInfo({
                                                    photoFilters: {
                                                        ...personalInfo.photoFilters!,
                                                        borderWidth: checked ? 4 : 0,
                                                        borderColor: checked ? '#ffffff' : undefined
                                                    }
                                                })}
                                            />
                                        </div>

                                        {(personalInfo.photoFilters?.borderWidth || 0) > 0 && (
                                            <div className="space-y-3 pt-2">
                                                <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                                                    <div className="flex justify-between text-xs">
                                                        <Label>Border Width</Label>
                                                        <span className="text-muted-foreground">{personalInfo.photoFilters?.borderWidth}px</span>
                                                    </div>
                                                    <Input
                                                        type="range"
                                                        min="1"
                                                        max="10"
                                                        step="1"
                                                        value={personalInfo.photoFilters?.borderWidth || 4}
                                                        onChange={(e) => setPersonalInfo({
                                                            photoFilters: { ...personalInfo.photoFilters!, borderWidth: parseInt(e.target.value) }
                                                        })}
                                                        className="h-6"
                                                    />
                                                </div>
                                                <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                                                    <div className="flex justify-between text-xs">
                                                        <Label>Border Color</Label>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="color"
                                                            value={personalInfo.photoFilters?.borderColor || '#ffffff'}
                                                            onChange={(e) => setPersonalInfo({
                                                                photoFilters: { ...personalInfo.photoFilters!, borderColor: e.target.value }
                                                            })}
                                                            className="h-8 w-full p-1 cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
