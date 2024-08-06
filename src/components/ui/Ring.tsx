import { forwardRef } from "react";

export const Ring = forwardRef<HTMLDivElement, React.PropsWithoutRef<{ id: string, items: React.ReactElement[] }>>(({ id, items }, ref) => {
    return (
        <div ref={ref} id={id} className="ring-container">
            {items}
        </div>
    )
});