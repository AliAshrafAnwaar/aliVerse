<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
        'location',
        'website',
        'github_url',
        'linkedin_url',
        'twitter_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => 'string',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<string>
     */
    protected $appends = ['avatar_url', 'profile_completion'];

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Get the posts created by this user.
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the projects created by this user.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the comments created by this user.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar ? '/storage/' . $this->avatar : '/images/default-avatar.png';
    }

    /**
     * Calculate profile completion percentage.
     */
    public function getProfileCompletionAttribute(): int
    {
        $fields = ['avatar', 'bio', 'location', 'website', 'github_url', 'linkedin_url', 'twitter_url'];
        $completed = 0;
        
        foreach ($fields as $field) {
            if (!empty($this->$field)) {
                $completed++;
            }
        }
        
        return round(($completed / count($fields)) * 100);
    }

    /**
     * Get formatted social URLs.
     */
    public function getFormattedGithubUrlAttribute(): ?string
    {
        return $this->github_url ? preg_replace('/^https?:\/\/(?:www\.)?github\.com\//', '', $this->github_url) : null;
    }

    public function getFormattedLinkedinUrlAttribute(): ?string
    {
        return $this->linkedin_url ? preg_replace('/^https?:\/\/(?:www\.)?linkedin\.com\/in\//', '', $this->linkedin_url) : null;
    }

    public function getFormattedTwitterUrlAttribute(): ?string
    {
        return $this->twitter_url ? preg_replace('/^https?:\/\/(?:www\.)?twitter\.com\//', '', $this->twitter_url) : null;
    }
}
