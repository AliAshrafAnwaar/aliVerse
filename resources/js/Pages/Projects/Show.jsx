import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, ExternalLink, Github, Calendar, Eye, Heart } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ project }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout>
            <Head title={project.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href={route('projects.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back_to_projects', 'Back to Projects')}
                            </Button>
                        </Link>
                    </div>

                    {/* Project Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Project Image */}
                            <div className="lg:w-1/3">
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    {project.image ? (
                                        <img
                                            src={project.thumbnail_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <div className="text-6xl mb-2">📦</div>
                                                <div>{t('projects.no_image', 'No image available')}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="lg:w-2/3">
                                <div className="mb-4">
                                    {project.featured && (
                                        <Badge variant="secondary" className="mb-2">
                                            {t('projects.featured', 'Featured')}
                                        </Badge>
                                    )}
                                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                        {project.title}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {project.description}
                                    </p>
                                </div>

                                {/* Technologies */}
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            {t('projects.technologies', 'Technologies')}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, index) => (
                                                <Badge key={index} variant="outline">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                <div className="flex flex-wrap gap-3">
                                    {project.demo_url && (
                                        <Button asChild>
                                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                {t('projects.live_demo', 'Live Demo')}
                                            </a>
                                        </Button>
                                    )}
                                    {project.github_url && (
                                        <Button variant="outline" asChild>
                                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                                <Github className="h-4 w-4 mr-2" />
                                                {t('projects.view_source', 'View Source')}
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    {/* Project Content */}
                    {project.content && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('projects.about_this_project', 'About This Project')}
                            </h2>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: project.content }} />
                            </div>
                        </div>
                    )}

                    {/* Project Gallery */}
                    {project.images && project.images.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('projects.gallery', 'Gallery')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.images.map((image) => (
                                    <div key={image.id} className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <img
                                            src={image.url}
                                            alt={image.alt_text || project.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                            onClick={() => window.open(image.url, '_blank')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator className="my-8" />

                    {/* Project Meta */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {t('projects.created_on', 'Created on')} {new Date(project.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            {t('projects.views_count', 'Views')}: {project.views_count || 0}
                        </div>
                        <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            {t('projects.reactions_count', 'Reactions')}: {project.total_reactions_count || 0}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
