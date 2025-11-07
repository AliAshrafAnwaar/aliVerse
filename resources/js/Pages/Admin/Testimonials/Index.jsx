import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, Star, MessageSquare } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ testimonials, filters }) {
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

    const handleFeaturedFilter = (value) => {
        const url = new URL(window.location);
        
        if (value && value !== 'all') {
            url.searchParams.set('is_featured', value);
        } else {
            url.searchParams.delete('is_featured');
        }
        
        window.location.href = url.toString();
    };

    const handleActiveFilter = (value) => {
        const url = new URL(window.location);
        
        if (value && value !== 'all') {
            url.searchParams.set('is_active', value);
        } else {
            url.searchParams.delete('is_active');
        }
        
        window.location.href = url.toString();
    };

    const handleDelete = (id) => {
        if (confirm(t('testimonials.confirm_delete', 'Are you sure you want to delete this testimonial?'))) {
            router.delete(route('admin.testimonials.destroy', id));
        }
    };

    const getRatingStars = (rating) => {
        if (!rating) return null;
        
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AdminLayout header="Manage Testimonials">
            <Head title="Admin - Testimonials" />

            <div className="py-0">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('testimonials.admin_title', 'Manage Testimonials')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('testimonials.admin_description', 'Create and manage client testimonials')}
                            </p>
                        </div>
                        <Link href={route('admin.testimonials.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('testimonials.create_new', 'Create New')}
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={t('testimonials.search_placeholder', 'Search testimonials...')}
                                defaultValue={filters.search}
                                onChange={handleSearch}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filters.is_featured || 'all'} onValueChange={handleFeaturedFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('testimonials.filter_by_featured', 'Filter by featured')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('testimonials.all_statuses', 'All')}</SelectItem>
                                <SelectItem value="true">{t('testimonials.featured', 'Featured')}</SelectItem>
                                <SelectItem value="false">{t('testimonials.not_featured', 'Not Featured')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filters.is_active || 'all'} onValueChange={handleActiveFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('testimonials.filter_by_status', 'Filter by status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('testimonials.all_statuses', 'All')}</SelectItem>
                                <SelectItem value="true">{t('testimonials.active', 'Active')}</SelectItem>
                                <SelectItem value="false">{t('testimonials.inactive', 'Inactive')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Testimonials Table */}
                    {testimonials.data.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('testimonials.client', 'Client')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('testimonials.content', 'Content')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('testimonials.rating', 'Rating')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('testimonials.status', 'Status')}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {t('testimonials.actions', 'Actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {testimonials.data.map((testimonial) => (
                                            <tr key={testimonial.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {testimonial.client_image ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={testimonial.client_image}
                                                                    alt={testimonial.client_name}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                                    <MessageSquare className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {testimonial.client_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {testimonial.client_position && testimonial.client_company
                                                                    ? `${testimonial.client_position} at ${testimonial.client_company}`
                                                                    : testimonial.client_position || testimonial.client_company || '-'
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                                                        {truncateText(testimonial.content)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {testimonial.rating && (
                                                        <div className="flex items-center space-x-1">
                                                            <div className="flex space-x-1">
                                                                {getRatingStars(testimonial.rating)}
                                                            </div>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                {testimonial.rating}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-1">
                                                        {testimonial.is_featured && (
                                                            <Badge variant="default">
                                                                {t('testimonials.featured', 'Featured')}
                                                            </Badge>
                                                        )}
                                                        {testimonial.is_active ? (
                                                            <Badge variant="secondary">
                                                                {t('testimonials.active', 'Active')}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
                                                                {t('testimonials.inactive', 'Inactive')}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link href={route('admin.testimonials.show', testimonial)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.testimonials.edit', testimonial)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(testimonial.id)}
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
                                {t('testimonials.no_testimonials_found', 'No testimonials found')}
                            </div>
                            <Link href={route('admin.testimonials.create')}>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('testimonials.create_first', 'Create your first testimonial')}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {testimonials.links && testimonials.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-1">
                                {testimonials.links.map((link, index) => (
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
