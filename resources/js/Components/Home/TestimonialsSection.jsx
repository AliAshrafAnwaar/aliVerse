import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
    MessageSquare, 
    Star,
    Quote,
    Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TestimonialsSection({ testimonials }) {
    const { t } = useTranslation();

    // Don't render section if no testimonials data
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    // Get top 3 testimonials sorted by rating
    const getTopTestimonials = () => {
        return testimonials
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
    };

    const displayTestimonials = testimonials && testimonials.length > 0 ? getTopTestimonials() : [];

    const getRatingStars = (rating) => {
        const numRating = Number(rating);
        if (isNaN(numRating)) return null;

        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <Star
                        key={i}
                        className={`w-5 h-5 ${
                            i < Math.floor(numRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                        }`}
                    />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {numRating.toFixed(1)}
                </span>
            </div>
        );
    };

    const averageRating = displayTestimonials.length > 0 ? (
        (displayTestimonials.reduce((sum, t) => sum + (Number(t.rating) || 0), 0) / displayTestimonials.length).toFixed(1)
    ) : 0;

    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            {t('home.client_testimonials', 'Client Testimonials')}
                        </h2>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {t('home.testimonials_description', 'What clients and colleagues say about working together')}
                    </p>
                </div>

{/* Modern Clean Testimonials UI */}
                {displayTestimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayTestimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="group"
                            >
                                {/* Modern Testimonial Card */}
                                <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                    
                                    {/* Quote Icon - Larger and More Prominent */}
                                    <div className="mb-6">
                                        <Quote className="w-12 h-12 text-orange-500 dark:text-orange-400 opacity-50" />
                                    </div>

                                    {/* Rating Stars */}
                                    {testimonial.rating && (
                                        <div className="mb-6">
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${
                                                            i < Math.floor(Number(testimonial.rating))
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300 dark:text-gray-600'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Testimonial Content - Larger Text */}
                                    <blockquote className="mb-8">
                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                            "{testimonial.content}"
                                        </p>
                                    </blockquote>

                                    {/* Author Info - Improved Layout */}
                                    <div className="flex items-center gap-4 mt-auto">
                                        {testimonial.client_image ? (
                                            <img
                                                src={testimonial.client_image}
                                                alt={testimonial.client_name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-orange-200 dark:border-orange-800"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl border-2 border-orange-200 dark:border-orange-800">
                                                {testimonial.client_name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                                                {testimonial.client_name}
                                            </p>
                                            {(testimonial.client_position || testimonial.client_company) && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                                    {testimonial.client_position}
                                                    {testimonial.client_position && testimonial.client_company && ' • '}
                                                    {testimonial.client_company}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('portfolio.no_testimonials', 'No testimonials added yet.')}</p>
                    </div>
                )}
            </div>
        </section>
    );
}
