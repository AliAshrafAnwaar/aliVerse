import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Edit, Trash2, ExternalLink, MapPin, Calendar, Building } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ experience }) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (confirm(t('experiences.confirm_delete', 'Are you sure you want to delete this experience?'))) {
            router.delete(route('admin.experiences.destroy', experience.id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDuration = (experience) => {
        const start = formatDate(experience.start_date);
        const end = experience.is_current ? 'Present' : formatDate(experience.end_date);
        return `${start} - ${end}`;
    };

    return (
        <AdminLayout header="Experience Details">
            <Head title="Admin - Experience Details" />

            <div className="py-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('admin.experiences.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back', 'Back to Experiences')}
                            </Button>
                        </Link>
                    </div>

                    {/* Experience Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-16 w-16 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                <Building className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl">{experience.position}</CardTitle>
                                                <CardDescription className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {experience.company}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={route('admin.experiences.edit', experience)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {t('common.edit', 'Edit')}
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                {t('common.delete', 'Delete')}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Duration */}
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {getDuration(experience)}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        {experience.location && (
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {experience.location}
                                                </span>
                                            </div>
                                        )}

                                        {/* Company Website */}
                                        {experience.company_url && (
                                            <div className="flex items-center space-x-2">
                                                <ExternalLink className="h-4 w-4 text-gray-400" />
                                                <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                                                    <a 
                                                        href={experience.company_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        {t('experiences.visit_website', 'Visit Website')}
                                                    </a>
                                                </Button>
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                                {t('experiences.status', 'Status')}
                                            </h4>
                                            {experience.is_current ? (
                                                <Badge variant="default">
                                                    {t('experiences.current_position', 'Current Position')}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    {t('experiences.past_position', 'Past Position')}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {experience.description && (
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                                    {t('experiences.description', 'Description')}
                                                </h4>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                        {experience.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Metadata */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {t('experiences.metadata', 'Metadata')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('experiences.sort_order', 'Sort Order')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {experience.sort_order}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('common.created_at', 'Created At')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {new Date(experience.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('common.updated_at', 'Updated At')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {new Date(experience.updated_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {t('common.actions', 'Actions')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href={route('admin.experiences.edit', experience)} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            <Edit className="h-4 w-4 mr-2" />
                                            {t('common.edit', 'Edit')}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t('common.delete', 'Delete')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
