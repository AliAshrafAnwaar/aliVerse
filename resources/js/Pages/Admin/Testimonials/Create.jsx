import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    client_name: '',
    client_position: '',
    client_company: '',
    content: '',
    client_image: '',
    rating: 5,
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.testimonials.store'));
  };

  return (
    <AdminLayout header="Create Testimonial">
      <Head title="Admin - Create Testimonial" />
      <div className="py-0">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href={route('admin.testimonials.index')}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back', 'Back to Testimonials')}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('testimonials.create_new', 'Create New Testimonial')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('testimonials.create_description', 'Add a new testimonial from a client')}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('testimonials.details', 'Testimonial Details')}</CardTitle>
              <CardDescription>
                {t('testimonials.details_description', 'Enter client and testimonial information')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="client_name">{t('testimonials.client_name', 'Client Name')}</Label>
                  <Input id="client_name" value={data.client_name} onChange={(e) => setData('client_name', e.target.value)} required />
                  {errors.client_name && <p className="text-sm text-red-600">{errors.client_name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client_position">{t('testimonials.client_position', 'Client Position')}</Label>
                    <Input id="client_position" value={data.client_position} onChange={(e) => setData('client_position', e.target.value)} />
                    {errors.client_position && <p className="text-sm text-red-600">{errors.client_position}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_company">{t('testimonials.client_company', 'Client Company')}</Label>
                    <Input id="client_company" value={data.client_company} onChange={(e) => setData('client_company', e.target.value)} />
                    {errors.client_company && <p className="text-sm text-red-600">{errors.client_company}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">{t('testimonials.content', 'Content')}</Label>
                  <Textarea id="content" rows={4} value={data.content} onChange={(e) => setData('content', e.target.value)} required />
                  {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_image">{t('testimonials.client_image', 'Client Image URL')}</Label>
                  <Input id="client_image" type="url" value={data.client_image} onChange={(e) => setData('client_image', e.target.value)} />
                  {errors.client_image && <p className="text-sm text-red-600">{errors.client_image}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">{t('testimonials.rating', 'Rating')} (1-5)</Label>
                    <Input id="rating" type="number" min="1" max="5" value={data.rating} onChange={(e) => setData('rating', parseInt(e.target.value || '0'))} />
                    {errors.rating && <p className="text-sm text-red-600">{errors.rating}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">{t('testimonials.sort_order', 'Sort Order')}</Label>
                    <Input id="sort_order" type="number" min="0" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value || '0'))} />
                    {errors.sort_order && <p className="text-sm text-red-600">{errors.sort_order}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(v) => setData('is_featured', v)} />
                    <Label htmlFor="is_featured">{t('testimonials.featured', 'Featured')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData('is_active', v)} />
                    <Label htmlFor="is_active">{t('testimonials.active', 'Active')}</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Link href={route('admin.testimonials.index')}>
                    <Button variant="outline" type="button">{t('common.cancel', 'Cancel')}</Button>
                  </Link>
                  <Button type="submit" disabled={processing}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('common.create', 'Create')}
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
