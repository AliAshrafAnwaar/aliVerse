import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ education }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        institution: education.institution || '',
        degree: education.degree || '',
        field_of_study: education.field_of_study || '',
        description: education.description || '',
        start_date: education.start_date || '',
        end_date: education.end_date || '',
        grade: education.grade || '',
        location: education.location || '',
        sort_order: education.sort_order || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.educations.update', education.id));
    };

    return (
        <AdminLayout header="Edit Education">
            <Head title="Admin - Edit Education" />

            <div className="py-0">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('admin.educations.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back', 'Back to Education')}
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('educations.edit_education', 'Edit Education')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('educations.edit_description', 'Update the information for this educational experience')}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('educations.education_details', 'Education Details')}</CardTitle>
                            <CardDescription>
                                {t('educations.education_details_description', 'Update the information about this educational experience')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Institution */}
                                <div className="space-y-2">
                                    <Label htmlFor="institution">{t('educations.institution', 'Institution')}</Label>
                                    <Input
                                        id="institution"
                                        type="text"
                                        value={data.institution}
                                        onChange={(e) => setData('institution', e.target.value)}
                                        placeholder={t('educations.institution_placeholder', 'e.g., Harvard University, MIT, Stanford')}
                                        required
                                    />
                                    {errors.institution && (
                                        <p className="text-sm text-red-600">{errors.institution}</p>
                                    )}
                                </div>

                                {/* Degree */}
                                <div className="space-y-2">
                                    <Label htmlFor="degree">{t('educations.degree', 'Degree')}</Label>
                                    <Input
                                        id="degree"
                                        type="text"
                                        value={data.degree}
                                        onChange={(e) => setData('degree', e.target.value)}
                                        placeholder={t('educations.degree_placeholder', 'e.g., Bachelor of Science, Master of Arts, PhD')}
                                        required
                                    />
                                    {errors.degree && (
                                        <p className="text-sm text-red-600">{errors.degree}</p>
                                    )}
                                </div>

                                {/* Field of Study */}
                                <div className="space-y-2">
                                    <Label htmlFor="field_of_study">{t('educations.field_of_study', 'Field of Study')}</Label>
                                    <Input
                                        id="field_of_study"
                                        type="text"
                                        value={data.field_of_study}
                                        onChange={(e) => setData('field_of_study', e.target.value)}
                                        placeholder={t('educations.field_of_study_placeholder', 'e.g., Computer Science, Business Administration, Physics')}
                                    />
                                    {errors.field_of_study && (
                                        <p className="text-sm text-red-600">{errors.field_of_study}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">{t('educations.description', 'Description')}</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('educations.description_placeholder', 'Describe your studies, achievements, thesis, etc...')}
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">{t('educations.start_date', 'Start Date')}</Label>
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
                                        <Label htmlFor="end_date">{t('educations.end_date', 'End Date')}</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            min={data.start_date}
                                        />
                                        <p className="text-sm text-gray-500">
                                            {t('educations.end_date_description', 'Leave empty if still ongoing')}
                                        </p>
                                        {errors.end_date && (
                                            <p className="text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Grade */}
                                <div className="space-y-2">
                                    <Label htmlFor="grade">{t('educations.grade', 'Grade')}</Label>
                                    <Input
                                        id="grade"
                                        type="text"
                                        value={data.grade}
                                        onChange={(e) => setData('grade', e.target.value)}
                                        placeholder={t('educations.grade_placeholder', 'e.g., 3.8 GPA, Summa Cum Laude, First Class')}
                                    />
                                    {errors.grade && (
                                        <p className="text-sm text-red-600">{errors.grade}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">{t('educations.location', 'Location')}</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder={t('educations.location_placeholder', 'e.g., Cambridge, MA; London, UK')}
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">{t('educations.sort_order', 'Sort Order')}</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                        placeholder="0"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {t('educations.sort_order_description', 'Lower numbers appear first')}
                                    </p>
                                    {errors.sort_order && (
                                        <p className="text-sm text-red-600">{errors.sort_order}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('admin.educations.index')}>
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
