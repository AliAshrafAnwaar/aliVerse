<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $table = 'educations';
    protected $fillable = [
        'institution',
        'degree',
        'field_of_study',
        'description',
        'start_date',
        'end_date',
        'grade',
        'location',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'sort_order' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('start_date', 'desc');
    }

    public function getDurationAttribute()
    {
        $start = $this->start_date->format('Y');
        $end = $this->end_date ? $this->end_date->format('Y') : 'Present';
        return "$start - $end";
    }
}
