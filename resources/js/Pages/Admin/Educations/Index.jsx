import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Search, Plus, Edit, Trash2, Eye, GraduationCap } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ educations, filters }) {
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

    const handleDelete = (id) => {
        if (confirm(t('educations.confirm_delete', 'Are you sure you want to delete this education?'))) {
            router.delete(route('admin.educations.destroy', id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
        });
    };

    const getDuration = (education) => {
        const start = formatDate(education.start_date);
        const end = education.end_date ? formatDate(education.end_date) : 'Present';
        return `${start} - ${end}`;
    };

    return (
        <AdminLayout header="Manage Education">
            <Head title="Admin - Education" />

            <div className="py-0">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('educations.admin_title', 'Manage Education')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('educations.admin_description', 'Create and manage your educational background')}
                            </p>
                        </div>
                        <Link href={route('admin.educations.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('educations.create_new', 'Create New')}
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('educations.search_placeholder', 'Search education...')}
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Education Table */}
                    {educations.data.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('educations.education', 'Education')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('educations.institution', 'Institution')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('educations.duration', 'Duration')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('educations.location', 'Location')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('educations.actions', 'Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {educations.data.map((education) => (
                                            <tr key={education.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {education.degree}
                                                    </div>
                                                    {education.field_of_study && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {education.field_of_study}
                                                        </div>
                                                    )}
                                                    {education.grade && (
                                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            {t('educations.grade', 'Grade')}: {education.grade}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {education.institution}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {getDuration(education)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {education.location || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={route('admin.educations.show', education)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.educations.edit', education)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(education.id)}
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
                                {t('educations.no_education_found', 'No education found')}
                            </div>
                            <Link href={route('admin.educations.create')}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('educations.create_first', 'Add your first education')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {educations.links && educations.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                {educations.links.map((link, index) => (
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
