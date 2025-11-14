import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Building, ExternalLink, Github, Star, ArrowRight, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ModernProjectsSection({ projects, featuredProjects }) {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Get top projects - prioritize featured, then recent
    const displayProjects = featuredProjects && featuredProjects.length >= 3
        ? featuredProjects.slice(0, 6)
        : projects.slice(0, 6);

    // Extract unique technologies for filtering
    const allTechnologies = [...new Set(displayProjects.flatMap(p => p.technologies || []))].slice(0, 8);
    
    const filteredProjects = activeFilter === 'all' 
        ? displayProjects 
        : displayProjects.filter(project => project.technologies?.includes(activeFilter));

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Building className="w-6 h-6" />
                        {t('portfolio.featured_projects', 'Featured Projects')}
                    </CardTitle>
                    <Button variant="outline" asChild className="hidden md:flex">
                        <Link href="/projects" className="flex items-center gap-2">
                            {t('portfolio.view_all_projects', 'View All')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
                <CardDescription>
                    {t('portfolio.projects_preview_description', 'Showcase of my best work and creative solutions')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Technology Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeFilter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        All Projects
                    </button>
                    {allTechnologies.map((tech) => (
                        <button
                            key={tech}
                            onClick={() => setActiveFilter(tech)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                activeFilter === tech
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {tech}
                        </button>
                    ))}
                </div>

                {/* Projects Grid - Compact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProjects.map((project) => (
                    <Link key={project.id} href={route('projects.show', project.slug)} className="group">
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* Media */}
                            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <div className="aspect-[3/2] w-full">
                                    <img
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                {/* Featured Badge */}
                                {project.featured && (
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                            <Star className="w-3 h-3 mr-1 fill-white" />
                                            Featured
                                        </Badge>
                                    </div>
                                )}
                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 gap-2">
                                    {project.demo_url && (
                                        <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Demo
                                        </Button>
                                    )}
                                    {project.github_url && (
                                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                            <Github className="w-4 h-4 mr-1" />
                                            Code
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="p-4 space-y-2">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {project.technologies?.slice(0, 3).map((tech, i) => (
                                        <Badge key={i} variant="secondary" className="text-[10px]">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                </div>

                {/* View More Section */}
                {projects.length > 6 && (
                    <div className="mt-8 text-center">
                        <Button size="lg" asChild>
                            <Link href="/projects" className="flex items-center gap-2">
                                {t('portfolio.view_all_projects_count', `View All ${projects.length} Projects`)}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Mobile View All Button */}
                <div className="mt-6 text-center md:hidden">
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/projects">
                            {t('portfolio.view_all_projects', 'View All')}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
