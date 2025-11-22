/**
 * Box component - Generic container with semantic element support
 */
export default function Box({ 
    children, 
    className = '', 
    as: Component = 'div',
    ...props 
}) {
    return (
        <Component 
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
}
