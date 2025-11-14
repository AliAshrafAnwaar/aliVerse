import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Code2, Server, Wrench, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SkillsSection({ groupedSkills, featuredSkills }) {
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Wrench className="w-6 h-6" />
                    {t('portfolio.technical_skills', 'Technical Skills')}
                </CardTitle>
                <CardDescription>
                    {t('portfolio.skills_description', 'My technical expertise and proficiency levels')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Skills Grid */}
                {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                            const IconComponent = getCategoryIcon(category);
                            return (
                                <Card key={category} className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg capitalize">
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
            </CardContent>
        </Card>
    );
}
