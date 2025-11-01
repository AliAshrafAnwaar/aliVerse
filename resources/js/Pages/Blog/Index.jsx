import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostGrid from '@/Components/Blog/PostGrid';
import PostList from '@/Components/Blog/PostList';

export default function Index({ auth, posts, categories, tags, filters }) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        router.get(
          route('posts.index'),
          { ...filters, search: searchTerm },
          { preserveState: true, preserveScroll: true }
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key, value) => {
    router.get(
      route('posts.index'),
      { ...filters, [key]: value },
      { preserveState: true, preserveScroll: true }
    );
  };

  const clearFilters = () => {
    router.get(route('posts.index'), {}, { preserveState: true });
  };

  const hasActiveFilters = filters.search || filters.category || filters.status || filters.featured;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t('blog.title')} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('blog.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('blog.description')}
              </p>
            </div>
            
            {auth.user?.is_admin && (
              <Link href={route('admin.posts.create')}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('blog.create_post')}
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={t('blog.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={hasActiveFilters ? 'border-primary' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {t('common.filters')}
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      Object.keys(filters).filter(key => filters[key]).length
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.category')}
                      </label>
                      <Select
                        value={filters.category || ''}
                        onValueChange={(value) => handleFilterChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('blog.all_categories')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t('blog.all_categories')}</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.status')}
                      </label>
                      <Select
                        value={filters.status || ''}
                        onValueChange={(value) => handleFilterChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('blog.all_status')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t('blog.all_status')}</SelectItem>
                          <SelectItem value="draft">{t('blog.status.draft')}</SelectItem>
                          <SelectItem value="published">{t('blog.status.published')}</SelectItem>
                          <SelectItem value="scheduled">{t('blog.status.scheduled')}</SelectItem>
                          <SelectItem value="archived">{t('blog.status.archived')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Featured Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.featured')}
                      </label>
                      <Select
                        value={filters.featured?.toString() || ''}
                        onValueChange={(value) => handleFilterChange('featured', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('blog.all_posts')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{t('blog.all_posts')}</SelectItem>
                          <SelectItem value="true">{t('blog.featured_only')}</SelectItem>
                          <SelectItem value="false">{t('blog.not_featured')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        disabled={!hasActiveFilters}
                        className="w-full"
                      >
                        {t('common.clear_filters')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {t('blog.showing_results', {
                count: posts.data.length,
                total: posts.total,
              })}
            </p>
          </div>

          {/* Posts */}
          {viewMode === 'grid' ? (
            <PostGrid 
              posts={posts.data} 
              showActions={auth.user?.is_admin}
            />
          ) : (
            <PostList 
              posts={posts.data} 
              showActions={auth.user?.is_admin}
            />
          )}

          {/* Pagination */}
          {posts.links && posts.links.length > 3 && (
            <div className="mt-8">
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  {posts.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        link.active
                          ? 'bg-primary text-primary-foreground'
                          : link.url
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      preserveScroll
                    />
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Empty State */}
          {posts.data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                {t('blog.no_posts_found')}
              </div>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  {t('blog.clear_filters_and_try_again')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
