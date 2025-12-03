import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Search, Filter, Grid, List, Plus, X, ArrowUpDown, Tag as TagIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import PostGrid from '@/Components/Blog/PostGrid';
import PostList from '@/Components/Blog/PostList';

export default function Index({ auth, posts, categories, tags, filters }) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState(filters.tags ? filters.tags.split(',') : []);

  // Separate main categories and subcategories
  const mainCategories = useMemo(() => 
    categories.filter(c => c.type === 'main' || !c.parent_id), 
    [categories]
  );
  
  const subCategories = useMemo(() => {
    if (!filters.main_category) return [];
    return categories.filter(c => 
      c.parent_id && c.parent_id.toString() === filters.main_category.toString()
    );
  }, [categories, filters.main_category]);

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
    const newFilters = { ...filters, [key]: value };
    
    // Reset subcategory when main category changes
    if (key === 'main_category') {
      newFilters.category = '';
    }
    
    router.get(
      route('posts.index'),
      newFilters,
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleTagToggle = (tagId) => {
    const tagIdStr = tagId.toString();
    const newTags = selectedTags.includes(tagIdStr)
      ? selectedTags.filter(id => id !== tagIdStr)
      : [...selectedTags, tagIdStr];
    
    setSelectedTags(newTags);
    handleFilterChange('tags', newTags.join(','));
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    router.get(route('posts.index'), {}, { preserveState: true });
  };

  const hasActiveFilters = filters.search || filters.category || filters.main_category || filters.featured || filters.tags || filters.sort;
  const activeFilterCount = Object.keys(filters).filter((key) => !!filters[key]).length;

  return (
    <PublicLayout user={auth.user}>
      <Head title={t('blog.title')} />

      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          

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
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  {/* Category Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Main Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.main_category')}
                      </label>
                      <Select
                        value={filters.main_category || 'all'}
                        onValueChange={(value) => handleFilterChange('main_category', value === 'all' ? '' : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('blog.all_categories')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('blog.all_categories')}</SelectItem>
                          {mainCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color || '#6366f1' }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subcategory Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.subcategory')}
                      </label>
                      <Select
                        value={filters.category || 'all'}
                        onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
                        disabled={!filters.main_category}
                      >
                        <SelectTrigger className={!filters.main_category ? 'opacity-50' : ''}>
                          <SelectValue placeholder={filters.main_category ? t('blog.select_subcategory') : t('blog.select_main_first')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('blog.all_subcategories')}</SelectItem>
                          {subCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color || '#6366f1' }}
                                />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.sort_by')}
                      </label>
                      <Select
                        value={filters.sort || 'latest'}
                        onValueChange={(value) => handleFilterChange('sort', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">{t('blog.sort.latest')}</SelectItem>
                          <SelectItem value="oldest">{t('blog.sort.oldest')}</SelectItem>
                          <SelectItem value="popular">{t('blog.sort.popular')}</SelectItem>
                          <SelectItem value="title_asc">{t('blog.sort.title_asc')}</SelectItem>
                          <SelectItem value="title_desc">{t('blog.sort.title_desc')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Featured Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('blog.featured')}
                      </label>
                      <Select
                        value={filters.featured?.toString() || 'all'}
                        onValueChange={(value) => handleFilterChange('featured', value === 'all' ? '' : value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('blog.all_posts')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('blog.all_posts')}</SelectItem>
                          <SelectItem value="true">{t('blog.featured_only')}</SelectItem>
                          <SelectItem value="false">{t('blog.not_featured')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      {t('blog.filter_by_tags')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTags.includes(tag.id.toString()) ? 'default' : 'outline'}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: selectedTags.includes(tag.id.toString()) ? tag.color : 'transparent',
                            borderColor: tag.color,
                            color: selectedTags.includes(tag.id.toString()) ? '#fff' : tag.color,
                          }}
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          {tag.name}
                          {selectedTags.includes(tag.id.toString()) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="border-t pt-4 mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t('common.clear_filters')}
                    </Button>
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
    </PublicLayout>
  );
}
