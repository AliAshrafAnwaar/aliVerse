import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Edit, Trash2, GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ education }) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (confirm(t('educations.confirm_delete', 'Are you sure you want to delete this education?'))) {
            router.delete(route('admin.educations.destroy', education.id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getDuration = (education) => {
        const start = formatDate(education.start_date);
        const end = education.end_date ? formatDate(education.end_date) : 'Present';
        return `${start} - ${end}`;
    };

    return (
        <AdminLayout header="Education Details">
            <Head title="Admin - Education Details" />

            <div className="py-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('admin.educations.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back', 'Back to Education')}
                            </Button>
                        </Link>
                    </div>

                    {/* Education Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-16 w-16 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                                <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-300" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl">{education.degree}</CardTitle>
                                                <CardDescription className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {education.institution}
                                                </CardDescription>
                                                {education.field_of_study && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {education.field_of_study}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={route('admin.educations.edit', education)}>
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
                                                {getDuration(education)}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        {education.location && (
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {education.location}
                                                </span>
                                            </div>
                                        )}

                                        {/* Grade */}
                                        {education.grade && (
                                            <div className="flex items-center space-x-2">
                                                <Award className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {t('educations.grade', 'Grade')}: {education.grade}
                                                </span>
                                            </div>
                                        )}

                                        {/* Description */}
                                        {education.description && (
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                                    {t('educations.description', 'Description')}
                                                </h4>
                                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                        {education.description}
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
                                        {t('educations.metadata', 'Metadata')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('educations.sort_order', 'Sort Order')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {education.sort_order}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('common.created_at', 'Created At')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {new Date(education.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('common.updated_at', 'Updated At')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {new Date(education.updated_at).toLocaleDateString()}
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
                                    <Link href={route('admin.educations.edit', education)} className="w-full">
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
