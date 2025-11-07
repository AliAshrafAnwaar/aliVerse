import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ experience }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        company: experience.company || '',
        position: experience.position || '',
        description: experience.description || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        is_current: experience.is_current || false,
        location: experience.location || '',
        company_url: experience.company_url || '',
        sort_order: experience.sort_order || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.experiences.update', experience.id));
    };

    const handleCurrentChange = (checked) => {
        setData('is_current', checked);
        if (checked) {
            setData('end_date', '');
        }
    };

    return (
        <AdminLayout header="Edit Experience">
            <Head title="Admin - Edit Experience" />

            <div className="py-0">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('admin.experiences.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back', 'Back to Experiences')}
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('experiences.edit_experience', 'Edit Experience')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('experiences.edit_description', 'Update the information for this work experience')}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('experiences.experience_details', 'Experience Details')}</CardTitle>
                            <CardDescription>
                                {t('experiences.experience_details_description', 'Update the information about this work experience')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Company */}
                                <div className="space-y-2">
                                    <Label htmlFor="company">{t('experiences.company', 'Company')}</Label>
                                    <Input
                                        id="company"
                                        type="text"
                                        value={data.company}
                                        onChange={(e) => setData('company', e.target.value)}
                                        placeholder={t('experiences.company_placeholder', 'e.g., Google, Microsoft, Startup Inc.')}
                                        required
                                    />
                                    {errors.company && (
                                        <p className="text-sm text-red-600">{errors.company}</p>
                                    )}
                                </div>

                                {/* Position */}
                                <div className="space-y-2">
                                    <Label htmlFor="position">{t('experiences.position', 'Position')}</Label>
                                    <Input
                                        id="position"
                                        type="text"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                        placeholder={t('experiences.position_placeholder', 'e.g., Senior Developer, Product Manager')}
                                        required
                                    />
                                    {errors.position && (
                                        <p className="text-sm text-red-600">{errors.position}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">{t('experiences.description', 'Description')}</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('experiences.description_placeholder', 'Describe your responsibilities and achievements...')}
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">{t('experiences.start_date', 'Start Date')}</Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">{t('experiences.end_date', 'End Date')}</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            disabled={data.is_current}
                                            min={data.start_date}
                                        />
                                        {errors.end_date && (
                                            <p className="text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Is Current */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_current"
                                        checked={data.is_current}
                                        onCheckedChange={handleCurrentChange}
                                    />
                                    <Label htmlFor="is_current">
                                        {t('experiences.current_position', 'Current Position')}
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {t('experiences.current_description', 'Check this if you currently work here')}
                                </p>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">{t('experiences.location', 'Location')}</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder={t('experiences.location_placeholder', 'e.g., San Francisco, CA; Remote')}
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>

                                {/* Company URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="company_url">{t('experiences.company_url', 'Company Website')}</Label>
                                    <Input
                                        id="company_url"
                                        type="url"
                                        value={data.company_url}
                                        onChange={(e) => setData('company_url', e.target.value)}
                                        placeholder={t('experiences.company_url_placeholder', 'https://example.com')}
                                    />
                                    {errors.company_url && (
                                        <p className="text-sm text-red-600">{errors.company_url}</p>
                                    )}
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">{t('experiences.sort_order', 'Sort Order')}</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                        placeholder="0"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {t('experiences.sort_order_description', 'Lower numbers appear first')}
                                    </p>
                                    {errors.sort_order && (
                                        <p className="text-sm text-red-600">{errors.sort_order}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('admin.experiences.index')}>
                                        <Button variant="outline" type="button">
                                            {t('common.cancel', 'Cancel')}
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {t('common.update', 'Update')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
