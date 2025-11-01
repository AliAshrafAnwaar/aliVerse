<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'subtitle',
        'description',
        'email',
        'phone',
        'location',
        'website',
        'linkedin_url',
        'github_url',
        'twitter_url',
        'instagram_url',
        'facebook_url',
        'whatsapp_number',
        'telegram_username',
        'available_for_work',
        'response_time',
        'working_hours',
        'is_active',
        'meta_title',
        'meta_description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'available_for_work' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the contact information.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only active contact information.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get formatted social URLs.
     */
    public function getFormattedLinkedinUrlAttribute(): ?string
    {
        return $this->linkedin_url ? preg_replace('/^https?:\/\/(?:www\.)?linkedin\.com\/in\//', '', $this->linkedin_url) : null;
    }

    public function getFormattedGithubUrlAttribute(): ?string
    {
        return $this->github_url ? preg_replace('/^https?:\/\/(?:www\.)?github\.com\//', '', $this->github_url) : null;
    }

    public function getFormattedTwitterUrlAttribute(): ?string
    {
        return $this->twitter_url ? preg_replace('/^https?:\/\/(?:www\.)?twitter\.com\//', '', $this->twitter_url) : null;
    }

    public function getFormattedInstagramUrlAttribute(): ?string
    {
        return $this->instagram_url ? preg_replace('/^https?:\/\/(?:www\.)?instagram\.com\//', '', $this->instagram_url) : null;
    }

    public function getFormattedFacebookUrlAttribute(): ?string
    {
        return $this->facebook_url ? preg_replace('/^https?:\/\/(?:www\.)?facebook\.com\//', '', $this->facebook_url) : null;
    }
}
