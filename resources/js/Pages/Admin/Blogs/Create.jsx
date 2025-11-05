import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import PostForm from '@/Components/Blog/PostForm';
import ENDPOINTS from '@/api/endpoints';

export default function Create({ auth, categories, tags }) {
  const { t } = useTranslation();

  const handleSubmit = (formData) => {
    console.log('Submitting post with data:', formData);
    
    router.post(ENDPOINTS.POSTS.ADMIN.STORE, formData, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        console.log('Post created successfully', page);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      },
    });
  };

  return (
    <AdminLayout user={auth.user} header={t('blog.create_post')}>
      <Head title={t('blog.create_post')} />

      <div className="py-3">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('blog.create_post')}
            </h1>
            <p className="text-muted-foreground">
              {t('blog.create_post_description')}
            </p>
          </div>

          {/* Form */}
          <PostForm
            categories={categories}
            tags={tags}
            onSubmit={handleSubmit}
          />

          {/* Quick Actions */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t('blog.tips')}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• {t('blog.tip_featured_image')}</li>
              <li>• {t('blog.tip_excerpt')}</li>
              <li>• {t('blog.tip_tags')}</li>
              <li>• {t('blog.tip_seo')}</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
