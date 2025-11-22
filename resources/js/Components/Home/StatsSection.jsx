import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/Components/ui/card';
import { Briefcase, Code, Users, BookOpen } from 'lucide-react';

export default function StatsSection({ stats }) {
    const { t } = useTranslation();

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-3xl font-bold mb-1">{stats.total_experiences}+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.years_experience')}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{stats.total_skills} {t('home.skills')}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-3xl font-bold mb-1">{stats.total_projects}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.projects_completed')}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-3xl font-bold mb-1">{stats.total_testimonials}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.happy_clients')}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-center hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="text-3xl font-bold mb-1">{stats.total_posts}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.blog_articles')}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
