import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { GraduationCap, MapPin, Calendar, Award, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';

export default function EducationSection({ educations }) {
    const { t } = useTranslation();
    const scrollContainerRef = useRef(null);
    const firstCardRef = useRef(null);
    const lastCardRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [lineStyle, setLineStyle] = useState({});

    // Sort educations by start_date ascending (oldest first)
    const sortedEducations = [...educations].sort((a, b) => 
        new Date(a.start_date) - new Date(b.start_date)
    );

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Calculate timeline line positioning based on first and last card positions
    useLayoutEffect(() => {
        const updateLinePosition = () => {
            if (firstCardRef.current && lastCardRef.current && scrollContainerRef.current) {
                const containerRect = scrollContainerRef.current.getBoundingClientRect();
                const firstCardRect = firstCardRef.current.getBoundingClientRect();
                const lastCardRect = lastCardRef.current.getBoundingClientRect();
                
                // Calculate positions relative to container
                const firstNodeLeft = firstCardRect.left - containerRect.left + 200; // 200px = half card width (center position)
                const lastNodeLeft = lastCardRect.left - containerRect.left + 200;
                
                // Set line style to span from first node to last node
                setLineStyle({
                    left: `${firstNodeLeft -30}px`,
                    width: `${lastNodeLeft - firstNodeLeft}px`,
                    top: 'calc(2rem + 10px)'
                });
            }
        };

        updateLinePosition();
        
        // Update on scroll to handle horizontal scrolling
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', updateLinePosition);
            return () => scrollContainer.removeEventListener('scroll', updateLinePosition);
        }
    }, [sortedEducations.length]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
            setTimeout(updateScrollButtons, 300);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    const getDuration = (item) => {
        const start = formatDate(item.start_date);
        const end = item.end_date ? formatDate(item.end_date) : 'Present';
        return `${start} - ${end}`;
    };

    // Check scroll buttons on mount and resize
    useEffect(() => {
        const checkScroll = () => {
            setTimeout(updateScrollButtons, 100);
        };
        
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [educations]);

    if (!educations || educations.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {t('home.academic_background', 'Academic Background')}
                        </h2>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {t('home.education_description', 'Educational qualifications and continuous learning journey')}
                    </p>
                </div>

{/* Exact Portfolio Education UI */}
                <div className="relative">
                    {/* Desktop: Horizontal slider with navigation buttons */}
                    <div className="hidden lg:block relative">
                        {/* Scrollability fade indicators */}
                        {canScrollLeft && (
                            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10 pointer-events-none mt-10 mb-6" />
                        )}
                        {canScrollRight && (
                            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-gray-800 to-transparent z-10 pointer-events-none mt-10 mb-6" />
                        )}

                        {/* Left scroll button */}
                        {canScrollLeft && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-green-200 dark:border-green-700"
                                onClick={() => scroll('left')}
                            >
                                <ChevronLeft className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </Button>
                        )}

                        {/* Right scroll button */}
                        {canScrollRight && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-green-200 dark:border-green-700"
                                onClick={() => scroll('right')}
                            >
                                <ChevronRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </Button>
                        )}

                        {/* Horizontal scrollable container */}
                        <style>{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div className="relative overflow-hidden">
                            {/* Horizontal line connecting first to last node */}
                            <div 
                                className="absolute h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 z-0" 
                                style={lineStyle}
                            />
                            
                            <div 
                                ref={scrollContainerRef}
                                className="flex gap-6 overflow-x-auto scroll-smooth pb-6 pt-8 px-4 hide-scrollbar"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                onScroll={updateScrollButtons}
                            >
                            
                            {sortedEducations.map((education, index) => (
                                <div 
                                    key={education.id} 
                                    className="relative flex-shrink-0 pt-12" 
                                    style={{ width: '350px' }}
                                    ref={index === 0 ? firstCardRef : index === sortedEducations.length - 1 ? lastCardRef : null}
                                >
                                    {/* Timeline dot with pulse effect */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-sm z-10">
                                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                                    </div>

                                    {/* Education Card */}
                                    <div 
                                        className="group p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
                                        style={{ minHeight: '350px' }}
                                    >
                                        {/* Degree Icon */}
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>

                                        {/* Degree Title */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center leading-tight">
                                            {education.degree}
                                        </h3>

                                        {/* Institution */}
                                        <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2 text-center leading-tight">
                                            {education.institution}
                                        </p>

                                        {/* Field of Study */}
                                        {education.field_of_study && (
                                            <p className="text-sm text-muted-foreground text-center mb-3">
                                                {education.field_of_study}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                <Calendar className="w-3 h-3" />
                                                <span>{getDuration(education)}</span>
                                            </div>
                                            {education.location && (
                                                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{education.location}</span>
                                                </div>
                                            )}
                                            {education.grade && (
                                                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                    <Award className="w-3 h-3" />
                                                    <span>{education.grade}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description - Expandable */}
                                        {education.description && (
                                            <div className="mt-auto">
                                                <div 
                                                    className={`overflow-hidden transition-all duration-300 ${
                                                        expandedIds.has(education.id) ? 'max-h-96' : 'max-h-0'
                                                    }`}
                                                >
                                                    <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                            {education.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleExpand(education.id)}
                                                    className="mt-3 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1 mx-auto"
                                                >
                                                    {expandedIds.has(education.id) ? (
                                                        <>
                                                            Show Less <ChevronDown className="w-3 h-3 rotate-180" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Show More <ChevronDown className="w-3 h-3" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Vertical stack */}
                    <div className="lg:hidden space-y-6">
                        {sortedEducations.map((education) => (
                            <div key={education.id} className="relative">
                                <div className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                            <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center leading-tight">
                                        {education.degree}
                                    </h3>

                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2 text-center leading-tight">
                                        {education.institution}
                                    </p>

                                    {education.field_of_study && (
                                        <p className="text-sm text-muted-foreground text-center mb-3">
                                            {education.field_of_study}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                            <Calendar className="w-3 h-3" />
                                            <span>{getDuration(education)}</span>
                                        </div>
                                        {education.location && (
                                            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                <MapPin className="w-3 h-3" />
                                                <span>{education.location}</span>
                                            </div>
                                        )}
                                        {education.grade && (
                                            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                                <Award className="w-3 h-3" />
                                                <span>{education.grade}</span>
                                            </div>
                                        )}
                                    </div>

                                    {education.description && (
                                        <div>
                                            <div 
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    expandedIds.has(education.id) ? 'max-h-96' : 'max-h-0'
                                                }`}
                                            >
                                                <div className="border-t border-green-200 dark:border-green-800 pt-3 mt-3">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                        {education.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleExpand(education.id)}
                                                className="mt-3 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1 mx-auto"
                                            >
                                                {expandedIds.has(education.id) ? (
                                                    <>
                                                        Show Less <ChevronDown className="w-3 h-3 rotate-180" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Show More <ChevronDown className="w-3 h-3" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
