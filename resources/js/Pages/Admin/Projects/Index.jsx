import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, ExternalLink, Github } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ projects, filters }) {
    const { t } = useTranslation();

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

    const handleStatusFilter = (value) => {
        const url = new URL(window.location);
        
        if (value && value !== 'all') {
            url.searchParams.set('status', value);
        } else {
            url.searchParams.delete('status');
        }
        
        window.location.href = url.toString();
    };

    const handleDelete = (id) => {
        if (confirm(t('projects.confirm_delete', 'Are you sure you want to delete this project?'))) {
            router.delete(route('admin.projects.destroy', id));
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            published: 'default',
            draft: 'secondary',
            archived: 'outline',
        };
        
        return (
            <Badge variant={variants[status] || 'secondary'}>
                {t(`projects.status.${status}`, status)}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('projects.admin_title', 'Manage Projects')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('projects.admin_description', 'Create and manage your portfolio projects')}
                            </p>
                        </div>
                        <Link href={route('admin.projects.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('projects.create_new', 'Create New')}
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
                        <Select value={filters.status || 'all'} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('projects.filter_by_status', 'Filter by status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('projects.all_statuses', 'All Statuses')}</SelectItem>
                                <SelectItem value="published">{t('projects.status.published', 'Published')}</SelectItem>
                                <SelectItem value="draft">{t('projects.status.draft', 'Draft')}</SelectItem>
                                <SelectItem value="archived">{t('projects.status.archived', 'Archived')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Projects Table */}
                    {projects.data.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('projects.project', 'Project')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('projects.status', 'Status')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('projects.technologies', 'Technologies')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('projects.created', 'Created')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('projects.actions', 'Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {projects.data.map((project) => (
                                            <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {project.image ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-lg object-cover"
                                                                    src={project.thumbnail_url}
                                                                    alt={project.title}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">📦</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {project.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {project.slug}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(project.status)}
                                                    {project.featured && (
                                                        <Badge variant="secondary" className="ml-2">
                                                            {t('projects.featured', 'Featured')}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.technologies && project.technologies.slice(0, 3).map((tech, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {tech}
                                                            </Badge>
                                                        ))}
                                                        {project.technologies && project.technologies.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{project.technologies.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={route('projects.show', project.slug)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {project.demo_url && (
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {project.github_url && (
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                                                    <Github className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Link href={route('admin.projects.edit', project)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(project.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 dark:text-gray-400 mb-4">
                                {t('projects.no_projects_found', 'No projects found')}
                            </div>
                            <Link href={route('admin.projects.create')}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('projects.create_first', 'Create your first project')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {projects.links && projects.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
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
