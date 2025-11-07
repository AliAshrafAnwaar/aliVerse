import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ArrowLeft, Edit, Trash2, Star, MessageSquare } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ testimonial }) {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (confirm(t('testimonials.confirm_delete', 'Are you sure you want to delete this testimonial?'))) {
      router.delete(route('admin.testimonials.destroy', testimonial.id));
    }
  };

  const getRatingStars = (rating) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <AdminLayout header="Testimonial Details">
      <Head title="Admin - Testimonial Details" />

      <div className="py-0">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href={route('admin.testimonials.index')}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back', 'Back to Testimonials')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {testimonial.client_image ? (
                        <img src={testimonial.client_image} alt={testimonial.client_name} className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-2xl">{testimonial.client_name}</CardTitle>
                        <CardDescription>
                          {testimonial.client_position && testimonial.client_company
                            ? `${testimonial.client_position} · ${testimonial.client_company}`
                            : testimonial.client_position || testimonial.client_company || ''}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={route('admin.testimonials.edit', testimonial)}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          {t('common.edit', 'Edit')}
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('common.delete', 'Delete')}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {testimonial.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      {getRatingStars(testimonial.rating)}
                      <span className="text-sm text-muted-foreground">{testimonial.rating}/5</span>
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">"{testimonial.content}"</p>
                  <div className="mt-4 flex items-center gap-2">
                    {testimonial.is_featured && (
                      <Badge variant="secondary">{t('testimonials.featured', 'Featured')}</Badge>
                    )}
                    {testimonial.is_active ? (
                      <Badge variant="default">{t('testimonials.active', 'Active')}</Badge>
                    ) : (
                      <Badge variant="outline">{t('testimonials.inactive', 'Inactive')}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('testimonials.metadata', 'Metadata')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">{t('testimonials.sort_order', 'Sort Order')}</dt>
                      <dd className="text-sm">{testimonial.sort_order}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">{t('common.created_at', 'Created At')}</dt>
                      <dd className="text-sm">{new Date(testimonial.created_at).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">{t('common.updated_at', 'Updated At')}</dt>
                      <dd className="text-sm">{new Date(testimonial.updated_at).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
