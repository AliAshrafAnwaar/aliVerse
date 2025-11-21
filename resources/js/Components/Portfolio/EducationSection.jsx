import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { GraduationCap, MapPin, Calendar, Award, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';

export default function EducationSection({ educations }) {
    const { t } = useTranslation();
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [expandedIds, setExpandedIds] = useState(new Set());

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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <GraduationCap className="w-6 h-6" />
                    {t('portfolio.education', 'Education')}
                </CardTitle>
                <CardDescription>
                    {t('portfolio.education_description', 'Academic background and qualifications')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {/* Desktop: Horizontal slider with navigation buttons */}
                    <div className="hidden lg:block relative">
                        {/* Scrollability fade indicators */}
                        {canScrollLeft && (
                            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
                        )}
                        {canScrollRight && (
                            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
                        )}

                        {/* Left scroll button */}
                        {canScrollLeft && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/95 backdrop-blur-sm hover:bg-background shadow-md border-2"
                                onClick={() => scroll('left')}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        )}

                        {/* Right scroll button */}
                        {canScrollRight && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/95 backdrop-blur-sm hover:bg-background shadow-md border-2"
                                onClick={() => scroll('right')}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        )}

                        {/* Horizontal scrollable container */}
                        <style>{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div className="relative overflow-hidden">
                            {/* Horizontal line connecting all items - properly aligned and contained */}
                            <div 
                                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 z-0" 
                                style={{ top: 'calc(2rem + 10px)' }}
                            />
                            
                            <div 
                                ref={scrollContainerRef}
                                className="flex gap-6 overflow-x-auto scroll-smooth pb-6 pt-8 px-4 hide-scrollbar"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                onScroll={updateScrollButtons}
                            >
                            
                            {educations.map((education, index) => (
                                <div key={education.id} className="relative flex-shrink-0 pt-12" style={{ width: '400px' }}>
                                    {/* Timeline dot with pulse effect */}
                                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-sm z-10">
                                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                                    </div>

                                    {/* Education Card - Uniform height with expand */}
                                    <div 
                                        className="group p-6 rounded-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                                        style={{ minHeight: '320px' }}
                                    >
                                        {/* Degree and Institution */}
                                        <div className="mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                                {education.degree}
                                            </h3>
                                            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1 line-clamp-1">
                                                {education.institution}
                                            </p>
                                        </div>

                                        {/* Field of Study */}
                                        {education.field_of_study && (
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                                                {education.field_of_study}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-xs">{getDuration(education)}</span>
                                            </div>
                                            {education.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-xs line-clamp-1">{education.location}</span>
                                                </div>
                                            )}
                                            {education.grade && (
                                                <div className="flex items-center gap-1">
                                                    <Award className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-medium text-xs">{education.grade}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description - Expandable */}
                                        {education.description && (
                                            <div className="flex-1 flex flex-col">
                                                <div 
                                                    className={`overflow-hidden transition-all duration-300 ${
                                                        expandedIds.has(education.id) ? 'flex-1' : ''
                                                    }`}
                                                    style={{ 
                                                        maxHeight: expandedIds.has(education.id) ? '500px' : '60px'
                                                    }}
                                                >
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {education.description}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => toggleExpand(education.id)}
                                                    className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline mt-2 text-left flex items-center gap-1"
                                                >
                                                    <span>{expandedIds.has(education.id) ? 'Show less' : 'Show more'}</span>
                                                    <ChevronDown 
                                                        className={`w-4 h-4 transition-transform duration-300 ${
                                                            expandedIds.has(education.id) ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Vertical layout */}
                    <div className="lg:hidden">
                        {/* Continuous vertical line connecting all items */}
                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-emerald-500 to-green-500" />

                        <div className="space-y-6">
                            {educations.map((education, index) => (
                                <div key={education.id} className="relative pl-16">
                                    {/* Timeline dot with pulse effect */}
                                    <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-sm z-10">
                                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                                    </div>

                                    {/* Education Card */}
                                    <div className="group p-6 rounded-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-x-2">
                                        {/* Degree and Institution */}
                                        <div className="mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {education.degree}
                                            </h3>
                                            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                                                {education.institution}
                                            </p>
                                        </div>

                                        {/* Field of Study */}
                                        {education.field_of_study && (
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                                {education.field_of_study}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{getDuration(education)}</span>
                                            </div>
                                            {education.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{education.location}</span>
                                                </div>
                                            )}
                                            {education.grade && (
                                                <div className="flex items-center gap-1">
                                                    <Award className="w-4 h-4 text-yellow-500" />
                                                    <span className="font-medium">{education.grade}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {education.description && (
                                            <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                    {education.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
