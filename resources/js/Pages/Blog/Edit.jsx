import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostForm from '@/Components/Blog/PostForm';
import ENDPOINTS from '@/api/endpoints';

export default function Edit({ auth, post, categories, tags }) {
  const { t } = useTranslation();

  const handleSubmit = (formData) => {
    console.log('Updating post with data:', formData);
    
    // Use POST with _method override for file uploads
    router.post(ENDPOINTS.POSTS.ADMIN.UPDATE(post.id), {
      ...formData,
      _method: 'PUT',
    }, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        console.log('Post updated successfully', page);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      },
    });
  };

  const handleDelete = () => {
    if (confirm(t('blog.confirm_delete'))) {
      router.delete(ENDPOINTS.POSTS.ADMIN.DELETE(post.id));
    }
  };

  const handlePreview = () => {
    window.open(ENDPOINTS.POSTS.VIEW(post.slug), '_blank');
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t('blog.edit_post', { title: post.title })} />

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link href="/admin/blog">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('common.back')}
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('blog.edit_post')}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={post.status !== 'published'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('blog.preview')}
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{t('blog.created_at', { date: new Date(post.created_at).toLocaleDateString() })}</span>
              <span>•</span>
              <span>{t('blog.updated_at', { date: new Date(post.updated_at).toLocaleDateString() })}</span>
              {post.published_at && (
                <>
                  <span>•</span>
                  <span>{t('blog.published_at', { date: new Date(post.published_at).toLocaleDateString() })}</span>
                </>
              )}
            </div>
          </div>

          {/* Status Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">{t('blog.current_status')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('blog.status_info', { 
                    status: t(`blog.status.${post.status}`),
                    views: post.views_count 
                  })}
                </p>
              </div>
              
              <div className="flex gap-2">
                {post.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.post(ENDPOINTS.POSTS.ADMIN.PUBLISH(post.id))}
                  >
                    {t('blog.publish_now')}
                  </Button>
                )}
                {post.status === 'published' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.post(ENDPOINTS.POSTS.ADMIN.UNPUBLISH(post.id))}
                  >
                    {t('blog.unpublish')}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.post(ENDPOINTS.POSTS.ADMIN.TOGGLE_FEATURED(post.id))}
                >
                  {post.featured ? t('blog.unfeature') : t('blog.feature')}
                </Button>
              </div>
            </div>
          </div>

          {/* Form */}
          <PostForm
            post={post}
            categories={categories}
            tags={tags}
            onSubmit={handleSubmit}
          />

          {/* Post Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-1">{t('blog.views')}</h4>
              <p className="text-2xl font-bold">{post.views_count}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-1">{t('blog.reading_time')}</h4>
              <p className="text-2xl font-bold">{post.reading_time} {t('blog.minutes')}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-1">{t('blog.comments')}</h4>
              <p className="text-2xl font-bold">{post.comments?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
