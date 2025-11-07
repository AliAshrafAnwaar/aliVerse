import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ skills, filters, categories }) {
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

    const handleCategoryFilter = (value) => {
        const url = new URL(window.location);
        
        if (value && value !== 'all') {
            url.searchParams.set('category', value);
        } else {
            url.searchParams.delete('category');
        }
        
        window.location.href = url.toString();
    };

    const handleDelete = (id) => {
        if (confirm(t('skills.confirm_delete', 'Are you sure you want to delete this skill?'))) {
            router.delete(route('admin.skills.destroy', id));
        }
    };

    const getCategoryBadge = (category) => {
        const variants = {
            frontend: 'default',
            backend: 'secondary',
            tools: 'outline',
            soft_skills: 'destructive',
        };
        
        return (
            <Badge variant={variants[category] || 'secondary'}>
                {t(`skills.category.${category}`, category)}
            </Badge>
        );
    };

    const getProficiencyStars = (level) => {
        return Array.from({ length: 10 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <AdminLayout header="Manage Skills">
            <Head title="Admin - Skills" />

            <div className="py-0">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('skills.admin_title', 'Manage Skills')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('skills.admin_description', 'Create and manage your technical skills')}
                            </p>
                        </div>
                        <Link href={route('admin.skills.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('skills.create_new', 'Create New')}
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('skills.search_placeholder', 'Search skills...')}
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filters.category || 'all'} onValueChange={handleCategoryFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('skills.filter_by_category', 'Filter by category')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('skills.all_categories', 'All Categories')}</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {t(`skills.category.${category}`, category)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Skills Table */}
                    {skills.data.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('skills.skill', 'Skill')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('skills.category', 'Category')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('skills.proficiency', 'Proficiency')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('skills.created', 'Created')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('skills.actions', 'Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {skills.data.map((skill) => (
                                            <tr key={skill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {skill.icon ? (
                                                                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                    <span className="text-lg">{skill.icon}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">🛠️</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {skill.name}
                                                            </div>
                                                            {skill.is_featured && (
                                                                <Badge variant="secondary" className="mt-1">
                                                                    {t('skills.featured', 'Featured')}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getCategoryBadge(skill.category)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-1">
                                                        {getProficiencyStars(skill.proficiency_level)}
                                                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                            {skill.proficiency_level}/10
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(skill.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={route('admin.skills.show', skill)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.skills.edit', skill)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(skill.id)}
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
                                {t('skills.no_skills_found', 'No skills found')}
                            </div>
                            <Link href={route('admin.skills.create')}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('skills.create_first', 'Create your first skill')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {skills.links && skills.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                {skills.links.map((link, index) => (
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
