<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'name',
        'category',
        'proficiency_level',
        'icon',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'proficiency_level' => 'integer',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
