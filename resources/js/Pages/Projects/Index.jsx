import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import { Search, ExternalLink, Github, Star } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ projects, filters }) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    const handleSearch = (e) => {
        const value = e.target.value;
        const url = new URL(window.location);
        
        if (value) {
            url.searchParams.set('search', value);
        } else {
            url.searchParams.delete('search');
        }
        
        window.location.href = url.toString();
    };

    const handleFeaturedToggle = (checked) => {
        const url = new URL(window.location);
        
        if (checked) {
            url.searchParams.set('featured', '1');
        } else {
            url.searchParams.delete('featured');
        }
        
        window.location.href = url.toString();
    };

    return (
        <AuthenticatedLayout user={user} header={t('navigation.projects', 'Projects')}>
            <Head title={t('navigation.projects', 'Projects')} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Filters */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('projects.search_placeholder', 'Search projects...')}
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="featured"
                                checked={!!filters.featured}
                                onCheckedChange={handleFeaturedToggle}
                            />
                            <label
                                htmlFor="featured"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t('projects.featured_only', 'Featured only')}
                            </label>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {projects.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {projects.data.map((project) => (
                                <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                    {/* Project Image */}
                                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                                        <img
                                            src={project.thumbnail_url || '/images/default-project.png'}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                                    
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    <Link 
                                                        href={route('projects.show', project.slug)}
                                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {project.title}
                                                    </Link>
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <CardDescription className="line-clamp-2">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {/* Technologies */}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {project.technologies.slice(0, 3).map((tech, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                    {project.technologies.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{project.technologies.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Links */}
                                        <div className="flex space-x-2">
                                            <Link href={route('projects.show', project.slug)}>
                                                <Button variant="default" size="sm" className="flex-1">
                                                    {t('projects.view_details', 'View Details')}
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 dark:text-gray-400 mb-4">
                                {t('projects.no_projects_found', 'No projects found')}
                            </div>
                            <Button variant="outline" onClick={() => window.location.href = route('projects.index')}>
                                {t('projects.clear_filters', 'Clear Filters')}
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {projects.links && projects.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-1">
                                {projects.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
