import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { Badge } from '@/Components/ui/badge';
import { Label } from '@/Components/ui/label';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function PostForm({ 
  post = null, 
  categories = [], 
  tags = [], 
  onSubmit 
}) {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState(post?.tags?.map(tag => tag.id) || []);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.featured_image ? `/storage/${post.featured_image}` : null);

  const { data, setData, post: formPost, processing, errors, reset } = useForm({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category_id: post?.category_id || '',
    meta_description: post?.meta_description || '',
    meta_keywords: post?.meta_keywords || '',
    status: post?.status || 'draft',
    featured: post?.featured || false,
    published_at: post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
    tags: selectedTags,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setData('featured_image', file);
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
    setData('featured_image', null);
    document.getElementById('featured_image').value = '';
  };

  const handleTagToggle = (tagId) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newTags);
    setData('tags', newTags);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  const handleStatusChange = (status) => {
    setData('status', status);
    if (status === 'published' && !data.published_at) {
      setData('published_at', new Date().toISOString().slice(0, 16));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('blog.content')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">{t('blog.title')} *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder={t('blog.title_placeholder')}
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">{t('blog.excerpt')}</Label>
                <Textarea
                  id="excerpt"
                  value={data.excerpt}
                  onChange={(e) => setData('excerpt', e.target.value)}
                  placeholder={t('blog.excerpt_placeholder')}
                  rows={3}
                  className="mt-1"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">{t('blog.content')} *</Label>
                <Textarea
                  id="content"
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  placeholder={t('blog.content_placeholder')}
                  rows={12}
                  className="mt-1"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>{t('blog.featured_image')}</CardTitle>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Featured image preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Input
                    id="featured_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1"
                  />
                  {errors.featured_image && (
                    <p className="text-red-500 text-sm mt-1">{errors.featured_image}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t('blog.publish_settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">{t('blog.status')}</Label>
                <Select value={data.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t('blog.status.draft')}</SelectItem>
                    <SelectItem value="published">{t('blog.status.published')}</SelectItem>
                    <SelectItem value="scheduled">{t('blog.status.scheduled')}</SelectItem>
                    <SelectItem value="archived">{t('blog.status.archived')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>

              {(data.status === 'scheduled' || data.published_at) && (
                <div>
                  <Label htmlFor="published_at">{t('blog.publish_date')}</Label>
                  <Input
                    id="published_at"
                    type="datetime-local"
                    value={data.published_at}
                    onChange={(e) => setData('published_at', e.target.value)}
                    className="mt-1"
                  />
                  {errors.published_at && (
                    <p className="text-red-500 text-sm mt-1">{errors.published_at}</p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={data.featured}
                  onCheckedChange={(checked) => setData('featured', checked)}
                />
                <Label htmlFor="featured">{t('blog.featured_post')}</Label>
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>{t('blog.category')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={data.category_id?.toString()} onValueChange={(value) => setData('category_id', value ? parseInt(value) : '')}>
                <SelectTrigger>
                  <SelectValue placeholder={t('blog.select_category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>{t('blog.tags')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => handleTagToggle(tag.id)}
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>{t('blog.seo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_description">{t('blog.meta_description')}</Label>
                <Textarea
                  id="meta_description"
                  value={data.meta_description}
                  onChange={(e) => setData('meta_description', e.target.value)}
                  placeholder={t('blog.meta_description_placeholder')}
                  rows={2}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {data.meta_description?.length || 0}/160
                </p>
                {errors.meta_description && (
                  <p className="text-red-500 text-sm mt-1">{errors.meta_description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="meta_keywords">{t('blog.meta_keywords')}</Label>
                <Input
                  id="meta_keywords"
                  value={data.meta_keywords}
                  onChange={(e) => setData('meta_keywords', e.target.value)}
                  placeholder={t('blog.meta_keywords_placeholder')}
                  className="mt-1"
                />
                {errors.meta_keywords && (
                  <p className="text-red-500 text-sm mt-1">{errors.meta_keywords}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={processing}
        >
          {t('common.reset')}
        </Button>
        <Button
          type="submit"
          disabled={processing}
        >
          {processing ? t('common.saving') : (post ? t('common.update') : t('common.create'))}
        </Button>
      </div>
    </form>
  );
}
