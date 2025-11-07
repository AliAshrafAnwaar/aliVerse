import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { MessageSquare, Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TestimonialsSection({ testimonials, featuredTestimonials }) {
    const { t } = useTranslation();

    // Get top 3 testimonials - prioritize featured with highest ratings
    const getTopTestimonials = () => {
        if (featuredTestimonials && featuredTestimonials.length > 0) {
            return featuredTestimonials
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3);
        }
        return testimonials
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);
    };

    const displayTestimonials = getTopTestimonials();

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

    if (!displayTestimonials || displayTestimonials.length === 0) {
        return null;
    }

    const averageRating = displayTestimonials.length > 0 ? (
        (displayTestimonials.reduce((sum, t) => sum + (Number(t.rating) || 0), 0) / displayTestimonials.length).toFixed(1)
    ) : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <MessageSquare className="w-6 h-6" />
                    {t('portfolio.client_testimonials', 'Client Testimonials')}
                </CardTitle>
                <CardDescription>
                    {t('portfolio.testimonials_description', 'What clients say about working with me')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayTestimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="relative group"
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-3 -left-3 z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                                    index === 0 
                                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                                        : index === 1 
                                        ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                                        : 'bg-gradient-to-br from-orange-400 to-orange-600'
                                }`}>
                                    #{index + 1}
                                </div>
                            </div>

                            {/* Testimonial Card */}
                            <div className="h-full p-6 pt-8 rounded-xl border-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:shadow-2xl hover:border-primary transition-all duration-300 transform hover:-translate-y-2">
                                {/* Quote Icon */}
                                <Quote className="w-10 h-10 text-primary/20 mb-3" />

                                {/* Rating */}
                                {testimonial.rating && (
                                    <div className="mb-4">
                                        {getRatingStars(Number(testimonial.rating))}
                                    </div>
                                )}

                                {/* Content */}
                                <blockquote className="mb-6">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                        "{testimonial.content}"
                                    </p>
                                </blockquote>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 pt-4 border-t">
                                    {testimonial.client_image ? (
                                        <img
                                            src={testimonial.client_image}
                                            alt={testimonial.client_name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-primary/20">
                                            {testimonial.client_name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                            {testimonial.client_name}
                                        </p>
                                        {(testimonial.client_position || testimonial.client_company) && (
                                            <p className="text-sm text-muted-foreground truncate">
                                                {testimonial.client_position}
                                                {testimonial.client_position && testimonial.client_company && ' at '}
                                                {testimonial.client_company}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Featured Badge */}
                                {testimonial.is_featured && (
                                    <div className="absolute top-3 right-3">
                                        <div className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-white" />
                                            Featured
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Average Rating Summary */}
                {displayTestimonials.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-primary mb-2">
                                    {averageRating}
                                </div>
                                <div className="flex justify-center mb-1">
                                    {getRatingStars(averageRating)}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('portfolio.average_rating', 'Average Rating')}
                                </p>
                            </div>
                            <div className="h-16 w-px bg-gray-300 dark:bg-gray-600 hidden md:block" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {testimonials.length}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('portfolio.total_testimonials', 'Total Testimonials')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
