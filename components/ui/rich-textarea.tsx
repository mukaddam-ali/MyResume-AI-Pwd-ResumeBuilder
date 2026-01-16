
import React, { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextareaProps extends React.ComponentProps<typeof Textarea> {
    value?: string;
    onValueChange?: (value: string) => void;
}

export const RichTextarea = ({ className, value = '', onValueChange, ...props }: RichTextareaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormat = (formatChar: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${formatChar}${selected}${formatChar}${after}`;

        // Call onChange
        if (onValueChange) {
            onValueChange(newText);
        } else if (props.onChange) {
            // Fallback if typical onChange event is expected (though simplified here)
            // constructing a synthetic event is complex, simplified direct value update is preferred
        }

        // Restore selection (approximate)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + formatChar.length, end + formatChar.length);
        }, 0);
    };

    return (
        <div className={cn("relative", className)}>
            <div className="absolute right-2 top-2 z-10 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md border shadow-sm opacity-0 hover:opacity-100 transition-opacity focus-within:opacity-100 peer-focus:opacity-100">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted"
                    onClick={() => insertFormat('**')}
                    title="Bold (**text**)"
                >
                    <Bold className="h-3 w-3" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted"
                    onClick={() => insertFormat('*')}
                    title="Italic (*text*)"
                >
                    <Italic className="h-3 w-3" />
                </Button>
            </div>
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onValueChange && onValueChange(e.target.value)}
                className={cn("peer min-h-[80px]", className)}
                {...props}
            />
        </div>
    );
};
