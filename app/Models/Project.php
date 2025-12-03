<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\Reactable;
use App\Traits\Viewable;

class Project extends Model
{
    use HasFactory, Reactable, Viewable;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'content',
        'image',
        'demo_url',
        'github_url',
        'technologies',
        'featured',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'technologies' => 'array',
        'featured' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['thumbnail_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->latest();
    }

    public function scopeSearch($query, ?string $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function getThumbnailUrlAttribute(): string
    {
        return $this->image ? '/storage/' . $this->image : '/images/default-project.jpg';
    }

    public function getTechnologiesListAttribute(): string
    {
        return implode(', ', $this->technologies ?? []);
    }
}
