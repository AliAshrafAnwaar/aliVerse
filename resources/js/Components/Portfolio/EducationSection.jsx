import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EducationSection({ educations }) {
    const { t } = useTranslation();

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
                    {/* Continuous vertical line connecting all items */}
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-emerald-500 to-green-500" />

                    <div className="space-y-6">
                        {educations.map((education, index) => (
                            <div key={education.id} className="relative pl-16">
                                {/* Timeline dot with pulse effect */}
                                <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-lg z-10">
                                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                                </div>

                                {/* Education Card */}
                                <div className="group p-6 rounded-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-x-2">
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
            </CardContent>
        </Card>
    );
}
