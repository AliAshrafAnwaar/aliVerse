<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company',
        'position',
        'description',
        'start_date',
        'end_date',
        'is_current',
        'location',
        'company_url',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('start_date', 'desc');
    }

    public function getDurationAttribute()
    {
        $start = $this->start_date->format('M Y');
        $end = $this->is_current ? 'Present' : $this->end_date->format('M Y');
        return "$start - $end";
    }
}
