import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Tag, 
  Share2,
  Heart,
  MessageCircle,
  Edit
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import PostCard from '@/Components/Blog/PostCard';

export default function Show({ auth, post, relatedPosts, userReaction, reactionCounts }) {
  const { t } = useTranslation();
  const [commentContent, setCommentContent] = React.useState('');

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const handleReact = (type) => {
    if (!auth.user) {
      router.visit(route('login'));
      return;
    }

    router.post(
      route('reactions.add'),
      {
        reactable_type: 'App\\Models\\Post',
        reactable_id: post.id,
        type: type,
      },
      { preserveScroll: true }
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!auth.user) {
      router.visit(route('login'));
      return;
    }

    if (!commentContent.trim()) return;

    router.post(
      route('comments.store'),
      {
        commentable_type: 'App\\Models\\Post',
        commentable_id: post.id,
        content: commentContent,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setCommentContent('');
        }
      }
    );
  };

  return (
    <PublicLayout user={auth.user}>
      <Head title={post.title} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={route('posts.index')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back_to_blog')}
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <article className="mb-8">
            <header className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getStatusColor(post.status)}>
                  {t(`blog.status.${post.status}`)}
                </Badge>
                {post.featured && (
                  <Badge variant="secondary">
                    {t('blog.featured')}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center justify-between">
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
                    <span>{post.views_count} {t('blog.views')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {auth.user?.is_admin && (
                    <Link href={route('admin.posts.edit', post.id)}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        {t('common.edit')}
                      </Button>
                    </Link>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('blog.share')}
                  </Button>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8">
                <img
                  src={`/storage/${post.featured_image}`}
                  alt={post.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Categories and Tags */}
            {(post.category || post.tags?.length > 0) && (
              <div className="mb-6">
                {post.category && (
                  <div className="mb-3">
                    <Badge variant="outline" className="text-sm">
                      {post.category.name}
                    </Badge>
                  </div>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="leading-relaxed"
              />
            </div>

            {/* Reactions */}
            <Separator className="my-8" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={userReaction?.type === 'like' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleReact('like')}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${userReaction?.type === 'like' ? 'fill-current' : ''}`} />
                  {reactionCounts?.like || 0}
                </Button>
                
                <Button
                  variant={userReaction?.type === 'love' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleReact('love')}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${userReaction?.type === 'love' ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                  {reactionCounts?.love || 0}
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments?.length || 0} {t('blog.comments')}</span>
              </div>
            </div>
          </article>

          {/* Comment Form */}
          {auth.user && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">{t('blog.add_comment', 'Add a Comment')}</h2>
              <form onSubmit={handleCommentSubmit}>
                <Card>
                  <CardContent className="pt-6">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder={t('blog.comment_placeholder', 'Write your comment here...')}
                      className="w-full min-h-[100px] p-3 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground">
                        {commentContent.length}/1000
                      </span>
                      <Button type="submit" disabled={!commentContent.trim()}>
                        {t('blog.post_comment', 'Post Comment')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </section>
          )}

          {/* Comments Section */}
          {post.comments && post.comments.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('blog.comments')}</h2>
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{comment.user?.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">{t('blog.related_posts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
