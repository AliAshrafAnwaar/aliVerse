/**
 * Flex component - Flexible layout container
 */
export default function Flex({ 
    children, 
    className = '', 
    direction = 'row',
    align = 'start',
    justify = 'start',
    gap = '0',
    wrap = false,
    as: Component = 'div',
    ...props 
}) {
    const directionClass = {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        col: 'flex-col',
        'col-reverse': 'flex-col-reverse',
    }[direction];

    const alignClass = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
    }[align];

    const justifyClass = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
    }[justify];

    const gapClass = gap ? `gap-${gap}` : '';
    const wrapClass = wrap ? 'flex-wrap' : '';

    return (
        <Component 
            className={`flex ${directionClass} ${alignClass} ${justifyClass} ${gapClass} ${wrapClass} ${className}`.trim()}
            {...props}
        >
            {children}
        </Component>
    );
}
