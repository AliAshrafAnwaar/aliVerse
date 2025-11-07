import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, ExternalLink, MapPin, Calendar } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ experiences, filters }) {
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

    const handleCurrentFilter = (value) => {
        const url = new URL(window.location);
        
        if (value && value !== 'all') {
            url.searchParams.set('is_current', value);
        } else {
            url.searchParams.delete('is_current');
        }
        
        window.location.href = url.toString();
    };

    const handleDelete = (id) => {
        if (confirm(t('experiences.confirm_delete', 'Are you sure you want to delete this experience?'))) {
            router.delete(route('admin.experiences.destroy', id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    const getDuration = (experience) => {
        const start = formatDate(experience.start_date);
        const end = experience.is_current ? 'Present' : formatDate(experience.end_date);
        return `${start} - ${end}`;
    };

    return (
        <AdminLayout header="Manage Experiences">
            <Head title="Admin - Experiences" />

            <div className="py-0">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('experiences.admin_title', 'Manage Experiences')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('experiences.admin_description', 'Create and manage your work experiences')}
                            </p>
                        </div>
                        <Link href={route('admin.experiences.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('experiences.create_new', 'Create New')}
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('experiences.search_placeholder', 'Search experiences...')}
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filters.is_current || 'all'} onValueChange={handleCurrentFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('experiences.filter_by_status', 'Filter by status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('experiences.all_statuses', 'All Statuses')}</SelectItem>
                                <SelectItem value="true">{t('experiences.current', 'Current')}</SelectItem>
                                <SelectItem value="false">{t('experiences.past', 'Past')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Experiences Table */}
                    {experiences.data.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('experiences.position', 'Position')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('experiences.company', 'Company')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('experiences.duration', 'Duration')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('experiences.location', 'Location')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('experiences.status', 'Status')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('experiences.actions', 'Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {experiences.data.map((experience) => (
                                            <tr key={experience.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {experience.position}
                                                    </div>
                                                    {experience.description && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
                                                            {experience.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {experience.company}
                                                    </div>
                                                    {experience.company_url && (
                                                        <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                                                            <a 
                                                                href={experience.company_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                                {t('experiences.website', 'Website')}
                                                            </a>
                                                        </Button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {getDuration(experience)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {experience.location && (
                                                            <div className="flex items-center">
                                                                <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                                                                {experience.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {experience.is_current ? (
                                                        <Badge variant="default">
                                                            {t('experiences.current', 'Current')}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            {t('experiences.past', 'Past')}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={route('admin.experiences.show', experience)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.experiences.edit', experience)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(experience.id)}
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
                                {t('experiences.no_experiences_found', 'No experiences found')}
                            </div>
                            <Link href={route('admin.experiences.create')}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('experiences.create_first', 'Create your first experience')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {experiences.links && experiences.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                {experiences.links.map((link, index) => (
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
        </AdminLayout>
    );
}
