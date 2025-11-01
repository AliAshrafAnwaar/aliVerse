import React from 'react';
import PostCard from './PostCard';

export default function PostGrid({ posts, showActions = false }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          showActions={showActions}
        />
      ))}
    </div>
  );
}
