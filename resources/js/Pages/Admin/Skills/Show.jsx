import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Edit, Trash2, Star } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ skill }) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (confirm(t('skills.confirm_delete', 'Are you sure you want to delete this skill?'))) {
            router.delete(route('admin.skills.destroy', skill.id));
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
                className={`h-4 w-4 ${i < level ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <AdminLayout header="Skill Details">
            <Head title="Admin - Skill Details" />

            <div className="py-0">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('admin.skills.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back', 'Back to Skills')}
                            </Button>
                        </Link>
                    </div>

                    {/* Skill Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                {skill.icon ? (
                                                    <span className="text-2xl">{skill.icon}</span>
                                                ) : (
                                                    <span className="text-2xl">🛠️</span>
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl">{skill.name}</CardTitle>
                                                <CardDescription className="mt-1">
                                                    {getCategoryBadge(skill.category)}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={route('admin.skills.edit', skill)}>
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
                                        {/* Proficiency Level */}
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                                {t('skills.proficiency_level', 'Proficiency Level')}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    {getProficiencyStars(skill.proficiency_level)}
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {skill.proficiency_level}/10
                                                </span>
                                            </div>
                                        </div>

                                        {/* Featured Status */}
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                                {t('skills.status', 'Status')}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                {skill.is_featured ? (
                                                    <Badge variant="secondary">
                                                        {t('skills.featured', 'Featured')}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        {t('skills.standard', 'Standard')}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
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
                                        {t('skills.metadata', 'Metadata')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <dl className="space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('skills.sort_order', 'Sort Order')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {skill.sort_order}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('common.created_at', 'Created At')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {new Date(skill.created_at).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('common.updated_at', 'Updated At')}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-white">
                                                {new Date(skill.updated_at).toLocaleDateString()}
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
                                    <Link href={route('admin.skills.edit', skill)} className="w-full">
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
