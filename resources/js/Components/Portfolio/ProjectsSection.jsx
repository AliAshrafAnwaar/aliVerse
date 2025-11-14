import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Building, ExternalLink, Github, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';

export default function ProjectsSection({ projects, featuredProjects }) {
    const { t } = useTranslation();
    
    // Get top 3 projects - prioritize featured, then recent
    const displayProjects = featuredProjects && featuredProjects.length >= 3
        ? featuredProjects.slice(0, 3)
        : projects.slice(0, 3);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Building className="w-6 h-6" />
                            {t('portfolio.featured_projects', 'Featured Projects')}
                        </CardTitle>
                        <CardDescription>
                            {t('portfolio.projects_preview_description', 'Showcase of my best work')}
                        </CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/projects">
                            {t('portfolio.view_all_projects', 'View All')}
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={route('projects.show', project.slug)}
                            className="group"
                        >
                            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
                                {/* Project Image */}
                                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={project.thumbnail_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <div className="flex gap-2">
                                            {project.demo_url && (
                                                <div className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Live Demo
                                                </div>
                                            )}
                                            {project.github_url && (
                                                <div className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <Github className="w-3 h-3" />
                                                    Code
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Featured Badge */}
                                    {project.featured && (
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                                <Star className="w-3 h-3 mr-1 fill-white" />
                                                Featured
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Project Info */}
                                <CardContent className="flex-1 flex flex-col p-5">
                                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.slice(0, 3).map((tech, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                        {project.technologies?.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{project.technologies.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* View More Link */}
                {projects.length > 3 && (
                    <div className="mt-6 text-center">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/projects">
                                {t('portfolio.view_all_projects_count', `View All ${projects.length} Projects`)}
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
