import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Code2, Server, Wrench, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DetailedSkillsSection({ groupedSkills, featuredSkills }) {
    const { t } = useTranslation();

    const getProficiencyLabel = (level) => {
        if (level >= 9) return { label: 'Expert', color: 'text-green-600 dark:text-green-400' };
        if (level >= 7) return { label: 'Advanced', color: 'text-blue-600 dark:text-blue-400' };
        if (level >= 5) return { label: 'Intermediate', color: 'text-purple-600 dark:text-purple-400' };
        return { label: 'Beginner', color: 'text-gray-600 dark:text-gray-400' };
    };

    const getCategoryIcon = (category) => {
        const icons = {
            frontend: Code2,
            backend: Server,
            tools: Wrench,
            soft_skills: Lightbulb,
        };
        return icons[category] || Wrench;
    };


    return (
        <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <Wrench className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {t('home.technical_expertise', 'Technical Expertise')}
                        </h2>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {t('home.skills_comprehensive_description', 'Complete breakdown of technical skills and proficiency levels across different domains')}
                    </p>
                </div>

{/* Exact Portfolio Skills UI */}
                {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                                    const IconComponent = getCategoryIcon(category);
                                    return (
                                        <Card key={category} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg capitalize leading-tight">
                                                            {t(`skills.category.${category}`, category.replace('_', ' '))}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs">
                                                            {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="space-y-3">
                                                    {categorySkills.map((skill) => {
                                                        const proficiency = getProficiencyLabel(skill.proficiency_level);
                                                        return (
                                                            <div 
                                                                key={skill.id}
                                                                className="space-y-2"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {skill.image_url && (
                                                                            <img 
                                                                                src={skill.image_url} 
                                                                                alt={skill.name} 
                                                                                className="h-5 w-5 rounded object-cover"
                                                                            />
                                                                        )}
                                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {skill.name}
                                                                        </span>
                                                                    </div>
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {skill.proficiency_level}/10
                                                                    </Badge>
                                                                </div>
                                                                
                                                                {/* Progress Bar */}
                                                                <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full transition-all duration-500"
                                                                        style={{ width: `${(skill.proficiency_level / 10) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                                
                                                                <div className="flex items-center justify-between">
                                                                    <span className={`text-xs font-medium ${proficiency.color}`}>
                                                                        {proficiency.label}
                                                                    </span>
                                                                    {skill.years_of_experience && (
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {skill.years_of_experience}+ {t('skills.years', 'years')}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : null}
            </div>
        </section>
    );
}
