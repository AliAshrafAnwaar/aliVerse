<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\PageView;
use Illuminate\Support\Facades\Request;

trait Viewable
{
    public function pageViews(): MorphMany
    {
        return $this->morphMany(PageView::class, 'viewable');
    }

    public function recordView(): void
    {
        $this->pageViews()->create([
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'referrer' => Request::header('referer'),
            'viewed_at' => now(),
        ]);
    }

    public function getViewsCount(): int
    {
        return $this->pageViews()->count();
    }

    public function getUniqueViewsCount(): int
    {
        return $this->pageViews()->distinct('ip_address')->count();
    }
}
