import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-6 z-10 cursor-move opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/50 rounded hover:bg-white"
            >
                <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
            {children}
        </div>
    );
}
