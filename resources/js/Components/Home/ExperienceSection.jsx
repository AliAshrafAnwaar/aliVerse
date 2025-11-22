import React, { useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ExperienceSection({ experiences, currentExperience }) {
    const { t } = useTranslation();

    // Memoize combined experiences array
    const allExperiences = useMemo(() => {
        const pastExperiences = experiences?.filter(exp => !exp.is_current) || [];
        return currentExperience 
            ? [...pastExperiences, currentExperience] 
            : pastExperiences;
    }, [experiences, currentExperience]);

    // Don't render section if no experience data
    if (!allExperiences || allExperiences.length === 0) {
        return null;
    }
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

    // Debounce helper
    const debounce = useCallback((func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }, []);

    // Determine column count based on Tailwind breakpoints
    useEffect(() => {
        const computeCols = () => {
            const w = window.innerWidth;
            if (w >= 1024) return 3;
            if (w >= 640) return 2;
            return 1;
        };
        const update = () => setCols(computeCols());
        update();
        
        const debouncedUpdate = debounce(update, 100);
        window.addEventListener('resize', debouncedUpdate);
        return () => window.removeEventListener('resize', debouncedUpdate);
    }, [debounce]);

    // Build SVG path
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const rafId = requestAnimationFrame(() => {
            const containerRect = container.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const edgePadding = -25;
            
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

        const pathPoints = [];
        rows.forEach((row, idx) => {
            const dir = idx % 2 === 0 ? 'R' : 'L';
            const orderedRow = idx % 2 === 0 ? row : [...row].reverse();
            orderedRow.forEach(p => pathPoints.push({ ...p, rowIdx: idx, rowDir: dir }));
        });

        let d = `M ${Math.round(pathPoints[0].x)} ${Math.round(pathPoints[0].y)}`;
        const cornerR = 14;

        for (let i = 1; i < pathPoints.length; i++) {
            const prev = pathPoints[i-1];
            const curr = pathPoints[i];
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;

            const isRowTransition = prev.rowIdx !== curr.rowIdx;

            if (isRowTransition) {
                const edgeX = prev.rowDir === 'R' ? (containerWidth - edgePadding) : edgePadding;
                const hSign = Math.sign(edgeX - prev.x) || 1;
                const vSign = Math.sign(curr.y - prev.y) || 1;
                const backSign = Math.sign(curr.x - edgeX) || -hSign;

                const hx = edgeX - hSign * cornerR;
                d += ` L ${Math.round(hx)} ${Math.round(prev.y)}`;

                const arc1Sweep = (hSign > 0 && vSign > 0) || (hSign < 0 && vSign < 0) ? 1 : 0;
                d += ` A ${cornerR} ${cornerR} 0 0 ${arc1Sweep} ${Math.round(edgeX)} ${Math.round(prev.y + vSign * cornerR)}`;

                const vy = curr.y - vSign * cornerR;
                d += ` L ${Math.round(edgeX)} ${Math.round(vy)}`;

                const arc2Sweep = (vSign > 0 && backSign < 0) || (vSign < 0 && backSign > 0) ? 1 : 0;
                const bx = edgeX + backSign * cornerR;
                d += ` A ${cornerR} ${cornerR} 0 0 ${arc2Sweep} ${Math.round(bx)} ${Math.round(curr.y)}`;

                const cx = (bx + curr.x) / 2;
                const cy = curr.y;
                d += ` Q ${Math.round(cx)} ${Math.round(cy)}, ${Math.round(curr.x)} ${Math.round(curr.y)}`;
            } else {
                const cx = (prev.x + curr.x) / 2;
                const cy = (prev.y + curr.y) / 2 - 0.6;
                d += ` Q ${Math.round(cx)} ${Math.round(cy)}, ${Math.round(curr.x)} ${Math.round(curr.y)}`;
            }
        }

            setPathD(d);
        });
        
        return () => cancelAnimationFrame(rafId);
    }, [allExperiences, recalc, openIds]);

    useEffect(() => {
        const handleResize = () => setRecalc((c) => c + 1);
        const debouncedResize = debounce(handleResize, 0);

        const el = containerRef.current;
        let ro;
        if (el && 'ResizeObserver' in window) {
            ro = new ResizeObserver(debounce(() => setRecalc((c) => c + 1), 0));
            ro.observe(el);
        }

        return () => {
            if (ro) ro.disconnect();
        };
    }, [debounce]);

    useEffect(() => {
        let rafId;
        let frameCount = 0;
        const maxFrames = 45;
        
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

    useEffect(() => {
        return () => {
            const { enter, leave } = hoverTimers.current;
            Object.values(enter).forEach((id) => clearTimeout(id));
            Object.values(leave).forEach((id) => clearTimeout(id));
            hoverTimers.current.enter = {};
            hoverTimers.current.leave = {};
        };
    }, []);

    return (
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {t('home.professional_journey')}
                        </h2>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {t('home.experience_description')}
                    </p>
                </div>

{/* Exact Portfolio Experience UI */}
                <div className="p-12">
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
                                                            const lid = hoverTimers.current.leave[experience.id];
                                                            if (lid) {
                                                                clearTimeout(lid);
                                                                delete hoverTimers.current.leave[experience.id];
                                                            }
                                                            setHoveredId(experience.id);
                                                            setOpenIds((prev) => {
                                                                const next = new Set(prev);
                                                                next.add(experience.id);
                                                                return next;
                                                            });
                                                        }, [experience.id])}
                                                        onMouseLeave={useCallback(() => {
                                                            const eid = hoverTimers.current.enter[experience.id];
                                                            if (eid) {
                                                                clearTimeout(eid);
                                                                delete hoverTimers.current.enter[experience.id];
                                                            }
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
                                                        <div className={`p-6 rounded-xl border-2 ${
                                                            hoveredId === experience.id 
                                                                ? 'border-green-600 shadow-xl' 
                                                                : 'border-gray-200 dark:border-gray-700'
                                                        } bg-white dark:bg-gray-800 transition-all duration-300`}>
                                                            {/* Position and Company */}
                                                            <div className="mb-3">
                                                                <h3 className="text-xl font-bold leading-tight" style={{ color: 'var(--card-foreground)' }}>
                                                                    {experience.position}
                                                                </h3>
                                                                <p className="text-lg font-semibold mt-1 leading-tight" style={{ color: 'var(--success)' }}>
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

                                                    {/* Show more indicator */}
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
                </div>
            </div>
        </section>
    );
}
