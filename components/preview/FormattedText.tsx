
import React from 'react';

interface FormattedTextProps {
    text?: string;
    className?: string;
}

export const FormattedText = ({ text = '', className }: FormattedTextProps) => {
    if (!text) return null;

    // Simple parser for **bold** and *italic*
    // Split by regex and render segments
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={index}>{part.slice(1, -1)}</em>;
                }
                return part;
            })}
        </span>
    );
};
