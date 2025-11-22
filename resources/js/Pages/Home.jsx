import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    ArrowRight, 
    Mail, 
    User,
    Sparkles,
    Briefcase,
    Code,
    Users,
    BookOpen,
    Calendar,
    ExternalLink,
    Star,
    MessageSquare,
    Eye,
    Wrench,
    TrendingUp,
    Download, 
    Award,
    Github
} from 'lucide-react';

// Import Home components
import ProfileSection from '@/Components/Home/ProfileSection';
import StatsSection from '@/Components/Home/StatsSection';
import CTASection from '@/Components/Home/CTASection';
import DetailedSkillsSection from '@/Components/Home/DetailedSkillsSection';
import ExperienceSection from '@/Components/Home/ExperienceSection';
import EducationSection from '@/Components/Home/EducationSection';
import TestimonialsSection from '@/Components/Home/TestimonialsSection';

export default function HomePage({ 
    portfolioOwner, 
    stats, 
    featuredProjects, 
    latestProjects,
    latestPosts, 
    featuredSkills,
    groupedSkills,
    currentExperience,
    experiences,
    educations,
    testimonials 
}) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('featured');
    const [projectFilter, setProjectFilter] = useState('all');
    const [blogFilter, setBlogFilter] = useState('all');

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // Get all unique technologies from projects
    const allTechnologies = latestProjects ? 
        [...new Set(latestProjects.flatMap(p => p.technologies || []))].sort() : 
        [];

    // Filter projects based on selected technology
    const filteredProjects = projectFilter === 'all' 
        ? latestProjects 
        : latestProjects?.filter(p => p.technologies?.includes(projectFilter));

    // Get all unique categories from blog posts
    const allCategories = latestPosts ? 
        [...new Set(latestPosts.map(p => p.category?.name).filter(Boolean))] : 
        [];

    // Filter blog posts based on selected category
    const filteredPosts = blogFilter === 'all' 
        ? latestPosts 
        : latestPosts?.filter(p => p.category?.name === blogFilter);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getProficiencyLabel = (level) => {
        if (level >= 9) return { label: 'Expert', color: 'text-green-600 dark:text-green-400' };
        if (level >= 7) return { label: 'Advanced', color: 'text-blue-600 dark:text-blue-400' };
        if (level >= 5) return { label: 'Intermediate', color: 'text-purple-600 dark:text-purple-400' };
        return { label: 'Beginner', color: 'text-gray-600 dark:text-gray-400' };
    };

    return (
        <PublicLayout user={auth?.user} portfolioOwner={portfolioOwner}>
            <Head title={t('navigation.home', 'Home')} />

            {/* Add animation keyframes */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProfileSection 
                        portfolioOwner={portfolioOwner} 
                        isVisible={isVisible} 
                    />
                </div>
            </section>

            {/* Stats Section */}
            <StatsSection stats={stats} />

            {/* Comprehensive Skills Section */}
            <DetailedSkillsSection 
                groupedSkills={groupedSkills} 
                featuredSkills={featuredSkills} 
            />

            {/* Featured Projects Section */}
            {latestProjects && latestProjects.length > 0 && (
                <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                                    <Code className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {t('home.featured_projects')}
                                </h2>
                            </div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                {t('home.projects_description')}
                            </p>
                        </div>

                        {/* Technology Filter */}
                        {allTechnologies.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                                <Button
                                    variant={projectFilter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setProjectFilter('all')}
                                >
                                    All Projects
                                </Button>
                                {allTechnologies.map((tech) => (
                                    <Button
                                        key={tech}
                                        variant={projectFilter === tech ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setProjectFilter(tech)}
                                    >
                                        {tech}
                                    </Button>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects && filteredProjects.slice(0, 6).map((project) => (
                                <Link key={project.id} href={`/projects/${project.slug}`}>
                                    <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 group hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-2">
                                        {project.thumbnail_url && (
                                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                                <img 
                                                    src={project.thumbnail_url} 
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                                    {project.title}
                                                </CardTitle>
                                                {project.featured && (
                                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="line-clamp-2">
                                                {project.short_description || project.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies && project.technologies.slice(0, 3).map((tech, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-4">
                                                    {project.github_url && (
                                                        <div className="flex items-center gap-1">
                                                            <Github className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    {project.demo_url && (
                                                        <div className="flex items-center gap-1">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs">{formatDate(project.created_at)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Button size="lg" asChild>
                                <Link href="/projects">
                                    {t('home.view_all_projects')}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Experience Section */}
            <ExperienceSection 
                experiences={experiences} 
                currentExperience={currentExperience} 
            />

            {/* Education Section */}
            <EducationSection educations={educations} />

            {/* Testimonials Section */}
            <TestimonialsSection testimonials={testimonials} />

            {/* Latest Blog Posts Section */}
            {latestPosts && latestPosts.length > 0 && (
                <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                    {t('home.latest_blog_posts')}
                                </h2>
                            </div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                {t('home.blog_description')}
                            </p>
                        </div>

                        {/* Category Filter */}
                        {allCategories.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                                <Button
                                    variant={blogFilter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBlogFilter('all')}
                                >
                                    All Posts
                                </Button>
                                {allCategories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={blogFilter === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setBlogFilter(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filteredPosts && filteredPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`}>
                                    <Card className="h-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 group hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-2">
                                        {post.featured_image ? (
                                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                                <img 
                                                    src={post.featured_image} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center" style={{display: 'none'}}>
                                                    <BookOpen className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                                            </div>
                                        )}
                                        <CardHeader>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(post.published_at)}</span>
                                                {post.reading_time && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{post.reading_time} min read</span>
                                                    </>
                                                )}
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                                {post.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="line-clamp-3 mb-4">
                                                {post.excerpt}
                                            </CardDescription>
                                            {post.category && (
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {post.category.name}
                                                    </Badge>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/blog">
                                    {t('home.view_all_posts')}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <CTASection />
        </PublicLayout>
    );
}
