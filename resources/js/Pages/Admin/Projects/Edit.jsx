import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ project }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: project.title || '',
        slug: project.slug || '',
        description: project.description || '',
        content: project.content || '',
        image: null,
        gallery_images: [],
        gallery_alt_texts: [],
        delete_gallery_images: [],
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        technologies: project.technologies || [],
        featured: project.featured || false,
        status: project.status || 'draft',
        sort_order: project.sort_order || 0,
        _method: 'PUT',
    });

    const handleImageChange = (e) => {
        setData('image', e.target.files[0]);
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const newGalleryImages = [...data.gallery_images, ...files];
        const newAltTexts = [...data.gallery_alt_texts, ...files.map(() => '')];
        
        const totalImages = (project.images?.length || 0) - data.delete_gallery_images.length + newGalleryImages.length;
        if (totalImages > 10) {
            alert(t('projects.max_gallery_images', 'Maximum 10 gallery images allowed'));
            return;
        }
        
        setData(prevData => ({
            ...prevData,
            gallery_images: newGalleryImages,
            gallery_alt_texts: newAltTexts
        }));
    };

    const handleRemoveNewGalleryImage = (index) => {
        setData(prevData => ({
            ...prevData,
            gallery_images: prevData.gallery_images.filter((_, i) => i !== index),
            gallery_alt_texts: prevData.gallery_alt_texts.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteExistingImage = (imageId) => {
        setData('delete_gallery_images', [...data.delete_gallery_images, imageId]);
    };

    const handleUndoDeleteImage = (imageId) => {
        setData('delete_gallery_images', data.delete_gallery_images.filter(id => id !== imageId));
    };

    const handleAltTextChange = (index, value) => {
        const newAltTexts = [...data.gallery_alt_texts];
        newAltTexts[index] = value;
        setData('gallery_alt_texts', newAltTexts);
    };

    const handleTechnologyAdd = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTech = e.target.value.trim();
            if (!data.technologies.includes(newTech)) {
                setData('technologies', [...data.technologies, newTech]);
            }
            e.target.value = '';
        }
    };

    const handleTechnologyRemove = (techToRemove) => {
        setData('technologies', data.technologies.filter(tech => tech !== techToRemove));
    };

    const generateSlug = (title) => {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setData('slug', slug);
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData('title', title);
        if (!data.slug || data.slug === project.slug) {
            generateSlug(title);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.projects.update', project.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout header={`Edit ${project.title}`}>
            <Head title={`Edit ${project.title}`} />

            <div className="py-3">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t('projects.edit_project', 'Edit Project')}: {project.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('projects.edit_description', 'Update your project details')}
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('projects.basic_info', 'Basic Information')}</CardTitle>
                                    <CardDescription>
                                        {t('projects.basic_info_description', 'Essential details about your project')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="title">{t('projects.title', 'Title')} *</Label>
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={handleTitleChange}
                                                className="mt-1"
                                                required
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="slug">{t('projects.slug', 'URL Slug')} *</Label>
                                            <Input
                                                id="slug"
                                                type="text"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                            {errors.slug && (
                                                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">{t('projects.description', 'Description')} *</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="content">{t('projects.content', 'Content')}</Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            rows={8}
                                            className="mt-1"
                                            placeholder={t('projects.content_placeholder', 'Detailed description of your project...')}
                                        />
                                        {errors.content && (
                                            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Media */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('projects.media', 'Media')}</CardTitle>
                                    <CardDescription>
                                        {t('projects.media_description', 'Project image and visual assets')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Thumbnail Image */}
                                    <div>
                                        <Label htmlFor="image">{t('projects.thumbnail', 'Thumbnail Image')}</Label>
                                        <div className="mt-1 space-y-4">
                                            {/* Current Image */}
                                            {project.image && (
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={project.thumbnail_url}
                                                            alt="Current image"
                                                            className="h-16 w-16 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {t('projects.current_image', 'Current image')}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* New Image Upload */}
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1">
                                                    <Input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="mt-1"
                                                    />
                                                    {errors.image && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                                    )}
                                                </div>
                                                {data.image && (
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={URL.createObjectURL(data.image)}
                                                            alt="New preview"
                                                            className="h-16 w-16 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {t('projects.image_help', 'JPEG, PNG, JPG, GIF or WebP. Max 2MB.')}
                                        </p>
                                    </div>

                                    {/* Gallery Images */}
                                    <div>
                                        <Label>{t('projects.gallery_images', 'Gallery Images')}</Label>
                                        
                                        {/* Existing Gallery Images */}
                                        {project.images && project.images.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('projects.existing_images', 'Existing Images')}
                                                </p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                    {project.images.map((image) => (
                                                        <div 
                                                            key={image.id} 
                                                            className={`relative group ${
                                                                data.delete_gallery_images.includes(image.id) 
                                                                    ? 'opacity-50' 
                                                                    : ''
                                                            }`}
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt={image.alt_text || 'Gallery image'}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                            {data.delete_gallery_images.includes(image.id) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleUndoDeleteImage(image.id)}
                                                                    className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                                                                >
                                                                    {t('common.undo', 'Undo')}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteExistingImage(image.id)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            {image.alt_text && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                                    {image.alt_text}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* New Gallery Images Upload */}
                                        <div className="mt-4">
                                            <Input
                                                id="gallery_images"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleGalleryImagesChange}
                                                className="mt-1"
                                                disabled={
                                                    (project.images?.length || 0) - 
                                                    data.delete_gallery_images.length + 
                                                    data.gallery_images.length >= 10
                                                }
                                            />
                                            {errors.gallery_images && (
                                                <p className="text-red-500 text-sm mt-1">{errors.gallery_images}</p>
                                            )}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {t('projects.gallery_help', 'Upload multiple images for gallery. Max 10 images, 2MB each.')}
                                            </p>
                                        </div>

                                        {/* New Gallery Images Preview */}
                                        {data.gallery_images.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('projects.new_images', 'New Images')}
                                                </p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                    {data.gallery_images.map((image, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                alt={`New gallery ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveNewGalleryImage(index)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            <div className="mt-2">
                                                                <Input
                                                                    type="text"
                                                                    placeholder={t('projects.alt_text', 'Alt text (optional)')}
                                                                    value={data.gallery_alt_texts[index] || ''}
                                                                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                                                                    className="text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Links */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('projects.links', 'Links')}</CardTitle>
                                    <CardDescription>
                                        {t('projects.links_description', 'External links for your project')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="demo_url">{t('projects.demo_url', 'Demo URL')}</Label>
                                        <Input
                                            id="demo_url"
                                            type="url"
                                            value={data.demo_url}
                                            onChange={(e) => setData('demo_url', e.target.value)}
                                            className="mt-1"
                                            placeholder="https://example.com"
                                        />
                                        {errors.demo_url && (
                                            <p className="text-red-500 text-sm mt-1">{errors.demo_url}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="github_url">{t('projects.github_url', 'GitHub URL')}</Label>
                                        <Input
                                            id="github_url"
                                            type="url"
                                            value={data.github_url}
                                            onChange={(e) => setData('github_url', e.target.value)}
                                            className="mt-1"
                                            placeholder="https://github.com/username/repo"
                                        />
                                        {errors.github_url && (
                                            <p className="text-red-500 text-sm mt-1">{errors.github_url}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Technologies */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('projects.technologies', 'Technologies')}</CardTitle>
                                    <CardDescription>
                                        {t('projects.technologies_description', 'Technologies used in this project')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>{t('projects.add_technology', 'Add Technology')}</Label>
                                        <Input
                                            type="text"
                                            onKeyDown={handleTechnologyAdd}
                                            className="mt-1"
                                            placeholder={t('projects.technology_placeholder', 'Type a technology and press Enter')}
                                        />
                                    </div>
                                    {data.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {data.technologies.map((tech, index) => (
                                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                    {tech}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTechnologyRemove(tech)}
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {errors.technologies && (
                                        <p className="text-red-500 text-sm mt-1">{errors.technologies}</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('projects.settings', 'Settings')}</CardTitle>
                                    <CardDescription>
                                        {t('projects.settings_description', 'Project configuration and visibility')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="status">{t('projects.status', 'Status')} *</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">{t('projects.status.draft', 'Draft')}</SelectItem>
                                                    <SelectItem value="published">{t('projects.status.published', 'Published')}</SelectItem>
                                                    <SelectItem value="archived">{t('projects.status.archived', 'Archived')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status && (
                                                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="sort_order">{t('projects.sort_order', 'Sort Order')}</Label>
                                            <Input
                                                id="sort_order"
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                                className="mt-1"
                                                min="0"
                                            />
                                            {errors.sort_order && (
                                                <p className="text-red-500 text-sm mt-1">{errors.sort_order}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="featured"
                                            checked={data.featured}
                                            onCheckedChange={(checked) => setData('featured', checked)}
                                        />
                                        <Label htmlFor="featured">
                                            {t('projects.featured_project', 'Featured Project')}
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex justify-end space-x-4">
                                <Link href={route('admin.projects.index')}>
                                    <Button variant="outline" type="button">
                                        {t('common.cancel', 'Cancel')}
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? t('common.updating', 'Updating...') : t('projects.update_project', 'Update Project')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
