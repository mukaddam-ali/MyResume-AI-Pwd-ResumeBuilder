
import React from 'react';
import { Text } from '@react-pdf/renderer';

interface PdfFormattedTextProps {
    text?: string;
    style?: any;
}

export const PdfFormattedText = ({ text = '', style, children }: PdfFormattedTextProps & { children?: React.ReactNode }) => {
    if (!text && !children) return null;

    // Simple parser for **bold** and *italic*
    // Split by regex and render segments
    const parts = text ? text.split(/(\*\*.*?\*\*|\*.*?\*)/g) : [];

    return (
        <Text style={style}>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <Text key={index} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    // Ensure the font family supports italic if needed, standard fonts do.
                    return <Text key={index} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</Text>;
                }
                // Determine if we need to escape anything? React-pdf handles text content safely usually.
                return <Text key={index}>{part}</Text>;
            })}
            {children}
        </Text>
    );
};
