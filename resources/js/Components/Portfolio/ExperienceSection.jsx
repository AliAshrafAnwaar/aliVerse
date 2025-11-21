import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback } from 'react';

export default function ExperienceSection({ experiences, currentExperience }) {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const nodeRefs = useRef([]);
    const contentRefs = useRef([]);
    const [pathD, setPathD] = useState('');
    const [recalc, setRecalc] = useState(0);
    const [hoveredId, setHoveredId] = useState(null);
    const [openIds, setOpenIds] = useState(new Set());
    const hoverTimers = useRef({ enter: {}, leave: {} });
    const [cols, setCols] = useState(1);

    // Memoize date formatting functions
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    }, []);

    const getDuration = useCallback((item) => {
        const start = formatDate(item.start_date);
        const end = item.end_date ? formatDate(item.end_date) : 'Present';
        return `${start} - ${end}`;
    }, [formatDate]);

    // Memoize combined experiences array
    const allExperiences = useMemo(() => {
        const pastExperiences = experiences.filter(exp => !exp.is_current);
        return currentExperience 
            ? [...pastExperiences, currentExperience] 
            : pastExperiences;
    }, [experiences, currentExperience]);

    // Debounce helper
    const debounce = useCallback((func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }, []);

    // Determine column count based on Tailwind breakpoints (base:1, sm:2, lg:3)
    useEffect(() => {
        const computeCols = () => {
            const w = window.innerWidth;
            if (w >= 1024) return 3; // lg
            if (w >= 640) return 2;  // sm
            return 1;
        };
        const update = () => setCols(computeCols());
        update();
        
        // Debounce resize handler (100ms)
        const debouncedUpdate = debounce(update, 100);
        window.addEventListener('resize', debouncedUpdate);
        return () => window.removeEventListener('resize', debouncedUpdate);
    }, [debounce]);

    // Build a path THROUGH nodes; on row transitions, route to container edge then down and back
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Batch all DOM reads in a single rAF
        const rafId = requestAnimationFrame(() => {
            const containerRect = container.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const edgePadding = -25; // larger padding to avoid clipping at container bounds
            
            // Batch all getBoundingClientRect calls
            const points = nodeRefs.current
                .filter(Boolean)
                .map((node, index) => {
                    const rect = node.getBoundingClientRect();
                    return {
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top + rect.height / 2,
                        left: rect.left - containerRect.left,
                        top: rect.top - containerRect.top,
                        index: index,
                    };
                });

        if (points.length === 0) {
            setPathD('');
            return;
        }

        // Group points into rows by approximate Y position
        const rowThreshold = 80;
        const rows = [];
        const sorted = [...points].sort((a, b) => {
            const topDiff = a.top - b.top;
            if (Math.abs(topDiff) < rowThreshold) {
                return a.left - b.left;
            }
            return topDiff;
        });

        let currentRow = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            const point = sorted[i];
            const last = currentRow[currentRow.length - 1];
            if (Math.abs(point.top - last.top) < rowThreshold) {
                currentRow.push(point);
            } else {
                rows.push(currentRow);
                currentRow = [point];
            }
        }
        if (currentRow.length) rows.push(currentRow);

        // Prepare path points in snake traversal: left->right for even rows, right->left for odd
        const pathPoints = [];
        rows.forEach((row, idx) => {
            const dir = idx % 2 === 0 ? 'R' : 'L'; // row direction
            const orderedRow = idx % 2 === 0 ? row : [...row].reverse();
            orderedRow.forEach(p => pathPoints.push({ ...p, rowIdx: idx, rowDir: dir }));
        });

        let d = `M ${Math.round(pathPoints[0].x)} ${Math.round(pathPoints[0].y)}`;
        const cornerR = 14; // radius for rounded 90-degree edge turns

        for (let i = 1; i < pathPoints.length; i++) {
            const prev = pathPoints[i-1];
            const curr = pathPoints[i];
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;

            const isRowTransition = prev.rowIdx !== curr.rowIdx;

            if (isRowTransition) {
                // Route to container edge based on previous row direction (to keep snake shape)
                const edgeX = prev.rowDir === 'R' ? (containerWidth - edgePadding) : edgePadding;

                // Directions
                const hSign = Math.sign(edgeX - prev.x) || 1; // heading toward edge
                const vSign = Math.sign(curr.y - prev.y) || 1; // down/up between rows
                const backSign = Math.sign(curr.x - edgeX) || -hSign; // heading back from edge toward node

                // 1) Horizontal toward edge, stop cornerR before the edge
                const hx = edgeX - hSign * cornerR;
                d += ` L ${Math.round(hx)} ${Math.round(prev.y)}`;

                // 2) Quarter-circle arc to turn vertical at the edge
                const arc1Sweep = (hSign > 0 && vSign > 0) || (hSign < 0 && vSign < 0) ? 1 : 0;
                d += ` A ${cornerR} ${cornerR} 0 0 ${arc1Sweep} ${Math.round(edgeX)} ${Math.round(prev.y + vSign * cornerR)}`;

                // 3) Vertical along the edge, stop cornerR before next row's y
                const vy = curr.y - vSign * cornerR;
                d += ` L ${Math.round(edgeX)} ${Math.round(vy)}`;

                // 4) Quarter-circle arc to turn horizontal from edge toward the node
                const arc2Sweep = (vSign > 0 && backSign < 0) || (vSign < 0 && backSign > 0) ? 1 : 0;
                const bx = edgeX + backSign * cornerR;
                d += ` A ${cornerR} ${cornerR} 0 0 ${arc2Sweep} ${Math.round(bx)} ${Math.round(curr.y)}`;

                // 5) Final segment to the node (smooth curve for niceness)
                const cx = (bx + curr.x) / 2;
                const cy = curr.y;
                d += ` Q ${Math.round(cx)} ${Math.round(cy)}, ${Math.round(curr.x)} ${Math.round(curr.y)}`;
            } else {
                // Same row: smooth quadratic bezier with vertical offset for visibility
                const cx = (prev.x + curr.x) / 2;
                // Add vertical offset to make the curve visible (negative = curve upward)
                const cy = (prev.y + curr.y) / 2 - 0.6;
                d += ` Q ${Math.round(cx)} ${Math.round(cy)}, ${Math.round(curr.x)} ${Math.round(curr.y)}`;
            }
        }

            setPathD(d);
        });
        
        return () => cancelAnimationFrame(rafId);
    }, [allExperiences, recalc, openIds]);

    // Consolidated resize handling with debouncing
    useEffect(() => {
        const handleResize = () => setRecalc((c) => c + 1);
        const debouncedResize = debounce(handleResize, 0);

        // Observe container size/content changes
        const el = containerRef.current;
        let ro;
        if (el && 'ResizeObserver' in window) {
            // Debounce ResizeObserver callbacks too
            ro = new ResizeObserver(debounce(() => setRecalc((c) => c + 1), 0));
            ro.observe(el);
        }

        return () => {
            if (ro) ro.disconnect();
        };
    }, [debounce]);

    // Smooth path updates during card expansion animation
    useEffect(() => {
        // Update path continuously during any card expansion to keep line attached to nodes
        let rafId;
        let frameCount = 0;
        const maxFrames = 45; // ~700ms at 60fps
        
        const updatePath = () => {
            setRecalc((c) => c + 1);
            frameCount++;
            
            if (frameCount < maxFrames && openIds.size > 0) {
                rafId = requestAnimationFrame(updatePath);
            }
        };
        
        if (openIds.size > 0) {
            rafId = requestAnimationFrame(updatePath);
        }
        
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [openIds]);

    // Cleanup hover timers on unmount
    useEffect(() => {
        return () => {
            const { enter, leave } = hoverTimers.current;
            Object.values(enter).forEach((id) => clearTimeout(id));
            Object.values(leave).forEach((id) => clearTimeout(id));
            hoverTimers.current.enter = {};
            hoverTimers.current.leave = {};
        };
    }, []);

    // No imperative animations: expansion is driven by CSS (grid rows)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Briefcase className="w-6 h-6" />
                    {t('portfolio.work_experience', 'Work Experience')}
                </CardTitle>
                <CardDescription>
                    {t('portfolio.experience_description', 'Professional journey and key accomplishments')}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
                <div ref={containerRef} className="relative">
                    {/* SVG layer for connector line */}
                    <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
                        style={{ overflow: 'visible' }}
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="expSnake" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>
                        </defs>
                        {pathD && (
                            <path 
                                d={pathD} 
                                fill="none" 
                                stroke="url(#expSnake)" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        )}
                    </svg>

                    {/* Cards rendered in rows with alternating reversed order */}
                    <div className="space-y-6">
                        {(() => {
                            const rows = [];
                            for (let i = 0; i < allExperiences.length; i += cols) {
                                rows.push(allExperiences.slice(i, i + cols));
                            }
                            let globalIdx = 0;
                            return rows.map((row, rowIdx) => {
                                const renderRow = rowIdx % 2 === 0 ? row : [...row].reverse();
                                // Center items when total is 2 or less
                                const shouldCenter = allExperiences.length <= 2;
                                return (
                                    <div 
                                        key={`row-${rowIdx}`} 
                                        className={`grid gap-6 ${shouldCenter ? 'justify-center' : ''}`} 
                                        style={{ 
                                            gridTemplateColumns: shouldCenter 
                                                ? `repeat(${row.length}, minmax(0, 400px))` 
                                                : `repeat(${cols}, minmax(0, 1fr))` 
                                        }}
                                    >
                                        {renderRow.map((experience) => {
                                            const idx = globalIdx++;
                                            return (
                                                <div 
                                                    key={experience.id} 
                                                    className="relative pt-12"
                                                    onMouseEnter={useCallback(() => {
                                                        // cancel pending leave
                                                        const lid = hoverTimers.current.leave[experience.id];
                                                        if (lid) {
                                                            clearTimeout(lid);
                                                            delete hoverTimers.current.leave[experience.id];
                                                        }
                                                        // open immediately and set hovered
                                                        setHoveredId(experience.id);
                                                        setOpenIds((prev) => {
                                                            const next = new Set(prev);
                                                            next.add(experience.id);
                                                            return next;
                                                        });
                                                    }, [experience.id])}
                                                    onMouseLeave={useCallback(() => {
                                                        // cancel pending enter
                                                        const eid = hoverTimers.current.enter[experience.id];
                                                        if (eid) {
                                                            clearTimeout(eid);
                                                            delete hoverTimers.current.enter[experience.id];
                                                        }
                                                        // schedule leave with debounce to avoid flicker at edges
                                                        const lid = setTimeout(() => {
                                                            setHoveredId((cur) => (cur === experience.id ? null : cur));
                                                            setOpenIds((prev) => {
                                                                const next = new Set(prev);
                                                                next.delete(experience.id);
                                                                return next;
                                                            });
                                                            delete hoverTimers.current.leave[experience.id];
                                                        }, 500);
                                                        hoverTimers.current.leave[experience.id] = lid;
                                                    }, [experience.id])}
                                                >
                                                    {/* Timeline node above this card */}
                                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
                                                        <div 
                                                            ref={(el) => (nodeRefs.current[idx] = el)}
                                                            className={`w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-lg relative
                                                                ${experience.is_current ? 'bg-green-500' : 'bg-green-400'}
                                                                ${hoveredId === experience.id ? 'ring-2 ring-green-300 scale-125' : ''} 
                                                                transition-all duration-300`}
                                                        >
                                                            {experience.is_current && (
                                                                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                                                            )}
                                                        </div>
                                                        <div className="mt-1 text-xs text-center font-medium text-gray-400 whitespace-nowrap">
                                                            {formatDate(experience.start_date)}
                                                        </div>
                                                    </div>

                                                    {/* Experience Card */}
                                                    <div className={`p-6 rounded-xl border ${
                                                        hoveredId === experience.id 
                                                            ? 'border-green-600 shadow-xl' 
                                                            : 'border-gray-800'
                                                    } var(--background) transition-all duration-300`}>
                                                        {/* Position and Company */}
                                                        <div className="mb-3">
                                                            <h3 className="text-xl font-bold" style={{ color: 'var(--card-foreground)' }}>
                                                                {experience.position}
                                                            </h3>
                                                            <p className="text-lg font-semibold mt-1" style={{ color: 'var(--success)' }}>
                                                                {experience.company}
                                                            </p>
                                                        </div>

                                                        {/* Metadata */}
                                                        <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{getDuration(experience)}</span>
                                                            </div>
                                                            {experience.location && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>{experience.location}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Description - Only visible on hover */}
                                                        {experience.description && (
                                                            <div
                                                                className="mt-0 transition-[padding,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                                                style={{
                                                                    paddingTop: openIds.has(experience.id) ? 16 : 0,
                                                                    borderTopColor: openIds.has(experience.id) ? 'var(--border)' : 'transparent',
                                                                    borderTopStyle: 'solid',
                                                                    borderTopWidth: 1
                                                                }}
                                                            >
                                                                <div
                                                                    className="grid overflow-hidden transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                                                    style={{ gridTemplateRows: openIds.has(experience.id) ? '1fr' : '0fr' }}
                                                                >
                                                                    <div className="min-h-0">
                                                                        <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--card-foreground)' }}>
                                                                            {experience.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                    </div>
                                                )}

                                                {/* Show more indicator (reserve space, animate visibility) */}
                                                {experience.description && (
                                                    <div
                                                        className="flex justify-center mt-2 h-5 text-xs text-center pointer-events-none"
                                                        aria-hidden="true"
                                                        style={{ color: 'var(--muted-foreground)' }}
                                                    >
                                                        <ChevronDown
                                                            className={`w-4 h-4 transition-all duration-300 ${
                                                                openIds.has(experience.id)
                                                                    ? 'opacity-0 translate-y-1'
                                                                    : 'opacity-100 animate-bounce'
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
