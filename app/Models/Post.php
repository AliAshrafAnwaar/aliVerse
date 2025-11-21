<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Traits\Reactable;
use App\Traits\Viewable;

class Post extends Model
{
    use HasFactory, SoftDeletes, Reactable, Viewable;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'meta_description',
        'meta_keywords',
        'status',
        'featured',
        'published_at',
        'views_count',
        'reading_time',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'reading_time' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function reactions()
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopePopular($query)
    {
        return $query->orderBy('views_count', 'desc');
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

    // Accessors
    public function getReadingTimeAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        // Calculate reading time based on content (200 words per minute)
        $wordCount = str_word_count(strip_tags($this->content));
        return max(1, ceil($wordCount / 200));
    }

    public function getExcerptAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        // Generate excerpt from content if not set
        $plainText = strip_tags($this->content);
        return Str::limit($plainText, 150, '...');
    }

    // Mutators
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    // Methods
    public function isPublished()
    {
        return $this->status === 'published' && $this->published_at && $this->published_at->isPast();
    }

    public function incrementViews()
    {
        // Use the recordView method from Viewable trait
        $this->recordView();
        
        // Also update views_count for backward compatibility
        $this->increment('views_count');
    }

    public function generateMetaDescription()
    {
        if (!$this->meta_description) {
            $this->meta_description = Str::limit(strip_tags($this->content), 160, '');
            $this->save();
        }
    }
}
