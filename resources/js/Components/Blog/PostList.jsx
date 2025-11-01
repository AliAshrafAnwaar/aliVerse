import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Calendar, Clock, Eye, User, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PostList({ posts, showActions = false }) {
  const { t } = useTranslation();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'archived':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No posts found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row">
            {post.featured_image && (
              <div className="md:w-1/3 lg:w-1/4">
                <img
                  src={`/storage/${post.featured_image}`}
                  alt={post.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(post.status)}>
                        {t(`blog.status.${post.status}`)}
                      </Badge>
                      {post.featured && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {t('blog.featured')}
                        </Badge>
                      )}
                    </div>
                    
                    <Link 
                      href={route('posts.show', post.slug)}
                      className="hover:text-primary transition-colors"
                    >
                      <h3 className="text-2xl font-semibold line-clamp-2 leading-tight mb-2">
                        {post.title}
                      </h3>
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.user?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.reading_time} {t('blog.min_read')}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views_count}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed text-base">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.category && (
                      <Badge variant="outline" className="text-xs">
                        {post.category.name}
                      </Badge>
                    )}
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            #{tag.name}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={route('posts.show', post.slug)}>
                      <Button variant="outline" size="sm">
                        {t('blog.read_more')}
                      </Button>
                    </Link>
                    
                    {showActions && (
                      <div className="flex gap-2">
                        <Link href={route('admin.posts.edit', post.id)}>
                          <Button variant="ghost" size="sm">
                            {t('common.edit')}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
