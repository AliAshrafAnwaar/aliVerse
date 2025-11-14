import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    ArrowLeft, 
    ExternalLink, 
    Github, 
    Calendar, 
    Eye, 
    Star,
    Briefcase,
    GraduationCap,
    Wrench,
    MessageSquare,
    MapPin,
    Award,
    Building
} from 'lucide-react';

export default function Portfolio({ skills, groupedSkills, experiences, educations, testimonials }) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

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

    const getProficiencyStars = (level) => {
        return Array.from({ length: 10 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const getRatingStars = (rating) => {
        if (!rating) return null;
        
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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

    const getCategoryBadge = (category) => {
        const variants = {
            frontend: 'default',
            backend: 'secondary',
            tools: 'outline',
            soft_skills: 'destructive',
        };
        
        return (
            <Badge variant={variants[category] || 'secondary'} className="capitalize">
                {t(`skills.category.${category}`, category)}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout user={user} header={t('navigation.portfolio', 'Portfolio')}>
            <Head title={t('navigation.portfolio', 'Portfolio')} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* User Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                                    <span className="text-primary-foreground font-bold text-xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    {user.name}
                                    <p className="text-sm text-muted-foreground font-normal">
                                        {user.email}
                                    </p>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                {t('portfolio.member_since', 'Member since')}: {new Date(user.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Skills Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="w-5 h-5" />
                                {t('portfolio.skills', 'Skills & Expertise')}
                            </CardTitle>
                            <CardDescription>
                                {t('portfolio.skills_description', 'Technical skills and proficiency levels')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {groupedSkills && Object.keys(groupedSkills).length > 0 ? (
                                <div className="space-y-6">
                                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                                        <div key={category}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg">{getCategoryIcon(category)}</span>
                                                <h3 className="text-lg font-semibold capitalize">
                                                    {t(`skills.category.${category}`, category)}
                                                </h3>
                                                {getCategoryBadge(category)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {categorySkills.map((skill) => (
                                                    <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg border">
                                                        <div className="flex items-center gap-3">
                                                            {skill.image_url ? (
                                                                <img src={skill.image_url} alt={skill.name} className="h-8 w-8 rounded-lg object-cover" />
                                                            ) : (
                                                                <span className="text-xl">🛠️</span>
                                                            )}
                                                            <div>
                                                                <div className="font-medium">{skill.name}</div>
                                                                {skill.is_featured && (
                                                                    <Badge variant="secondary" className="text-xs mt-1">
                                                                        {t('skills.featured', 'Featured')}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex space-x-1">
                                                                {getProficiencyStars(skill.proficiency_level)}
                                                            </div>
                                                            <span className="text-xs text-muted-foreground">
                                                                {skill.proficiency_level}/10
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('portfolio.no_skills', 'No skills added yet.')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Experience Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                {t('portfolio.experience', 'Work Experience')}
                            </CardTitle>
                            <CardDescription>
                                {t('portfolio.experience_description', 'Professional experience and career journey')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {experiences && experiences.length > 0 ? (
                                <div className="space-y-6">
                                    {experiences.map((experience) => (
                                        <div key={experience.id} className="border-l-2 border-primary pl-6 relative">
                                            <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-primary border-2 border-background"></div>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold">{experience.position}</h3>
                                                    <p className="text-primary font-medium">{experience.company}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {getDuration(experience)}
                                                        </div>
                                                        {experience.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {experience.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {experience.description && (
                                                        <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                            {experience.description}
                                                        </p>
                                                    )}
                                                    {experience.is_current && (
                                                        <Badge variant="default" className="mt-3">
                                                            {t('portfolio.current_position', 'Current Position')}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {experience.company_url && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a 
                                                            href={experience.company_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('portfolio.no_experience', 'No experience added yet.')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Education Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" />
                                {t('portfolio.education', 'Education')}
                            </CardTitle>
                            <CardDescription>
                                {t('portfolio.education_description', 'Academic background and qualifications')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {educations && educations.length > 0 ? (
                                <div className="space-y-6">
                                    {educations.map((education) => (
                                        <div key={education.id} className="border-l-2 border-green-500 pl-6 relative">
                                            <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background"></div>
                                            <div>
                                                <h3 className="text-lg font-semibold">{education.degree}</h3>
                                                <p className="text-green-600 dark:text-green-400 font-medium">{education.institution}</p>
                                                {education.field_of_study && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {education.field_of_study}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {getDuration(education)}
                                                    </div>
                                                    {education.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {education.location}
                                                        </div>
                                                    )}
                                                    {education.grade && (
                                                        <div className="flex items-center gap-1">
                                                            <Award className="w-4 h-4" />
                                                            {education.grade}
                                                        </div>
                                                    )}
                                                </div>
                                                {education.description && (
                                                    <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                        {education.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('portfolio.no_education', 'No education added yet.')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Testimonials Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                {t('portfolio.testimonials', 'Client Testimonials')}
                            </CardTitle>
                            <CardDescription>
                                {t('portfolio.testimonials_description', 'What clients say about my work')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {testimonials && testimonials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {testimonials.map((testimonial) => (
                                        <div key={testimonial.id} className="border rounded-lg p-6">
                                            {testimonial.rating && (
                                                <div className="flex items-center gap-1 mb-3">
                                                    {getRatingStars(testimonial.rating)}
                                                    <span className="text-sm text-muted-foreground ml-2">
                                                        {testimonial.rating}/5
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                                                "{testimonial.content}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                {testimonial.client_image ? (
                                                    <img
                                                        src={testimonial.client_image}
                                                        alt={testimonial.client_name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                        <MessageSquare className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{testimonial.client_name}</p>
                                                    {testimonial.client_position && testimonial.client_company && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {testimonial.client_position} at {testimonial.client_company}
                                                        </p>
                                                    ) || testimonial.client_position || testimonial.client_company}
                                                </div>
                                            </div>
                                            {testimonial.is_featured && (
                                                <Badge variant="secondary" className="mt-3">
                                                    {t('testimonials.featured', 'Featured')}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>{t('portfolio.no_testimonials', 'No testimonials added yet.')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                {t('portfolio.quick_actions', 'Quick Actions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link href="/projects">
                                    <Button variant="outline" className="w-full justify-start">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        {t('portfolio.view_projects', 'View Projects')}
                                    </Button>
                                </Link>
                                <Link href="/blog">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Eye className="w-4 h-4 mr-2" />
                                        {t('portfolio.read_blog', 'Read Blog')}
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Github className="w-4 h-4 mr-2" />
                                        {t('portfolio.contact_info', 'Contact Info')}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
