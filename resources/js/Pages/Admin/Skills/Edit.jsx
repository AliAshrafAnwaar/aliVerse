import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Slider } from '@/Components/ui/slider';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ skill, categories }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: skill.name || '',
        category: skill.category || '',
        proficiency_level: skill.proficiency_level || 5,
        image: null,
        is_featured: skill.is_featured || false,
        sort_order: skill.sort_order || 0,
        _method: 'PUT',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit via POST with method spoofing; Inertia will build FormData because of file
        post(route('admin.skills.update', skill.id), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AdminLayout header="Edit Skill">
            <Head title="Admin - Edit Skill" />

            <div className="py-0">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href={route('admin.skills.index')}>
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('common.back', 'Back to Skills')}
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('skills.edit_skill', 'Edit Skill')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('skills.edit_description', 'Update the information for this skill')}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('skills.skill_details', 'Skill Details')}</CardTitle>
                            <CardDescription>
                                {t('skills.skill_details_description', 'Update the basic information about this skill')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('skills.name', 'Name')}</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t('skills.name_placeholder', 'e.g., React, Python, Docker')}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">{t('skills.category', 'Category')}</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('skills.select_category', 'Select a category')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {t(`skills.category.${category}`, category)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>

                                {/* Proficiency Level */}
                                <div className="space-y-2">
                                    <Label htmlFor="proficiency_level">
                                        {t('skills.proficiency_level', 'Proficiency Level')}: {data.proficiency_level}/10
                                    </Label>
                                    <Slider
                                        id="proficiency_level"
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[data.proficiency_level]}
                                        onValueChange={(value) => setData('proficiency_level', value[0])}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{t('skills.beginner', 'Beginner')}</span>
                                        <span>{t('skills.expert', 'Expert')}</span>
                                    </div>
                                    {errors.proficiency_level && (
                                        <p className="text-sm text-red-600">{errors.proficiency_level}</p>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="space-y-2">
                                    <Label htmlFor="image">{t('skills.image', 'Image')}</Label>
                                    {skill.image_url && (
                                        <div className="mb-2">
                                            <img src={skill.image_url} alt={skill.name} className="h-16 w-16 object-cover rounded" />
                                        </div>
                                    )}
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">{t('skills.sort_order', 'Sort Order')}</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                                        placeholder="0"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {t('skills.sort_order_description', 'Lower numbers appear first')}
                                    </p>
                                    {errors.sort_order && (
                                        <p className="text-sm text-red-600">{errors.sort_order}</p>
                                    )}
                                </div>

                                {/* Is Featured */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked)}
                                    />
                                    <Label htmlFor="is_featured">
                                        {t('skills.featured', 'Featured Skill')}
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {t('skills.featured_description', 'Featured skills will be highlighted on your portfolio')}
                                </p>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('admin.skills.index')}>
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
