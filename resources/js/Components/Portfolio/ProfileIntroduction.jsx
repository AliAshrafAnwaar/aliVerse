import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { User, MapPin, Globe, Github, Linkedin, Twitter, Mail, Briefcase, Code, Award, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function ProfileIntroduction({ portfolioOwner, stats }) {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
                
                {/* Hero Card - Avatar + Name + Position */}
                <div className="md:col-span-2 lg:col-span-2 row-span-2">
                    <Card className={`h-full p-6 md:p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} hover:shadow-lg flex flex-col justify-between space-between`}>
                        <CardContent className="p-0 space-y-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="relative group">
                                        {portfolioOwner.avatar ? (
                                            <img 
                                                src={portfolioOwner.avatar_url} 
                                                alt={portfolioOwner.name}
                                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                                                <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}
                                        {/* Status indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-900">
                                            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Name and Position */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                        {portfolioOwner.name}
                                    </h1>
                                    {portfolioOwner.position && (
                                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium">
                                            {portfolioOwner.position}
                                        </p>
                                    )}
                                    
                                    {/* Location */}
                                    {portfolioOwner.location && (
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-gray-500 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">{portfolioOwner.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        {portfolioOwner.bio && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('portfolio.about', 'About')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {portfolioOwner.bio}
                                    </p>
                                </div>
                            )}
                    </Card>
                </div>

                {/* Stats Cards */}
                <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0 text-center space-y-2">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_projects}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('portfolio.projects', 'Projects')}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0 text-center space-y-2">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_skills}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('portfolio.skills', 'Skills')}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0 text-center space-y-2">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_experiences}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('portfolio.experience', 'Experience')}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0 text-center space-y-2">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_testimonials}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('portfolio.testimonials', 'Testimonials')}</div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
