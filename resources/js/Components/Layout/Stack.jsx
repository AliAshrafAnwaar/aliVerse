/**
 * Stack component - Vertical or horizontal spacing
 */
export default function Stack({ 
    children, 
    className = '', 
    spacing = '1',
    direction = 'vertical',
    as: Component = 'div',
    ...props 
}) {
    const spacingClass = direction === 'vertical' 
        ? `space-y-${spacing}` 
        : `space-x-${spacing}`;

    return (
        <Component 
            className={`${spacingClass} ${className}`.trim()}
            {...props}
        >
            {children}
        </Component>
    );
}
