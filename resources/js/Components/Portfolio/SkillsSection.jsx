import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Star, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SkillsSection({ groupedSkills, featuredSkills }) {
    const { t } = useTranslation();

    const getProficiencyStars = (level) => {
        return Array.from({ length: 10 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const getCategoryIcon = (category) => {
        const icons = {
            frontend: '⚛️',
            backend: '🔧',
            tools: '🛠️',
            soft_skills: '💡',
        };
        return icons[category] || '📚';
    };

    const getCategoryColor = (category) => {
        const colors = {
            frontend: 'from-blue-500 to-cyan-500',
            backend: 'from-green-500 to-emerald-500',
            tools: 'from-purple-500 to-pink-500',
            soft_skills: 'from-orange-500 to-red-500',
        };
        return colors[category] || 'from-gray-500 to-slate-500';
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
                {/* Skills by Category - Single Row of Categories, skills as columns with ratings */}
                {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
                    <div
                        className="gap-6"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${Object.keys(groupedSkills).length}, minmax(0, 1fr))`,
                        }}
                    >
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div key={category} className="space-y-4">
                                {/* Category Header */}
                                <div className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${getCategoryColor(category)} text-white`}>
                                    <span className="text-3xl">{getCategoryIcon(category)}</span>
                                    <div>
                                        <h3 className="text-xl font-bold capitalize">
                                            {t(`skills.category.${category}`, category.replace('_', ' '))}
                                        </h3>
                                        <p className="text-sm text-white/80">
                                            {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                                        </p>
                                    </div>
                                </div>

                                {/* Skills List as column with star ratings */}
                                <div className="space-y-2">
                                    {categorySkills.map((skill) => (
                                        <div 
                                            key={skill.id}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                {skill.icon && <span className="text-lg">{skill.icon}</span>}
                                                <span className="font-medium">{skill.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex">
                                                    {getProficiencyStars(skill.proficiency_level)}
                                                </div>
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    {skill.proficiency_level}/10
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
