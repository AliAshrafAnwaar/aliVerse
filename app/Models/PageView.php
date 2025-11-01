<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'viewable_type',
        'viewable_id',
        'ip_address',
        'user_agent',
        'referrer',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function viewable(): MorphTo
    {
        return $this->morphTo();
    }
}
