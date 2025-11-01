import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Calendar,
  Search,
  Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import ENDPOINTS from '@/api/endpoints';

export default function AdminIndex({ auth, posts, categories, tags, filters }) {
  const { t } = useTranslation();

  const handleSearch = (e) => {
    router.get(ENDPOINTS.POSTS.ADMIN.LIST, { ...filters, search: e.target.value }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleFilter = (key, value) => {
    router.get(ENDPOINTS.POSTS.ADMIN.LIST, { ...filters, [key]: value }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDelete = (id) => {
    if (confirm(t('blog.confirm_delete'))) {
      router.delete(ENDPOINTS.POSTS.ADMIN.DELETE(id));
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      scheduled: 'outline',
      archived: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {t(`blog.status.${status}`)}
      </Badge>
    );
  };

  return (
    <AdminLayout user={auth.user} header={t('blog.manage_posts')}>
      <Head title={t('blog.manage_posts')} />

      <div className="py-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('blog.manage_posts')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('blog.manage_posts_description')}
              </p>
            </div>
            <Link href={ENDPOINTS.POSTS.ADMIN.CREATE}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('blog.create_post')}
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {t('common.filters')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder={t('blog.search_posts')}
                    value={filters.search || ''}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilter('status', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('blog.filter_status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="draft">{t('blog.status.draft')}</SelectItem>
                    <SelectItem value="published">{t('blog.status.published')}</SelectItem>
                    <SelectItem value="scheduled">{t('blog.status.scheduled')}</SelectItem>
                    <SelectItem value="archived">{t('blog.status.archived')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category || 'all'}
                  onValueChange={(value) => handleFilter('category', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('blog.filter_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.featured || 'all'}
                  onValueChange={(value) => handleFilter('featured', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('blog.filter_featured')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="true">{t('blog.featured')}</SelectItem>
                    <SelectItem value="false">{t('blog.not_featured')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <Card>
            <CardContent className="p-0">
              {posts.data.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {filters.search || filters.status || filters.category || filters.featured
                      ? t('blog.no_posts_found')
                      : t('blog.no_posts_yet')}
                  </p>
                  {!filters.search && !filters.status && !filters.category && !filters.featured && (
                    <Link href={ENDPOINTS.POSTS.ADMIN.CREATE} className="mt-4 inline-block">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('blog.create_first_post')}
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('blog.title')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('blog.status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('blog.author')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('blog.created_at')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('common.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {posts.data.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={ENDPOINTS.POSTS.VIEW(post.slug)}
                                  target="_blank"
                                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  {post.title}
                                </Link>
                                {post.featured && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              {post.excerpt && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                {post.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {post.category.name}
                                  </Badge>
                                )}
                                {post.tags?.map((tag) => (
                                  <Badge key={tag.id} variant="secondary" className="text-xs">
                                    {tag.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {post.user?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={ENDPOINTS.POSTS.VIEW(post.slug)} target="_blank">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={ENDPOINTS.POSTS.ADMIN.EDIT(post.id)}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {posts.links && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                {posts.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-2 text-sm rounded-md ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
