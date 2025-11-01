<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Reaction;

trait Reactable
{
    public function reactions(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }

    public function getReactionCounts(): array
    {
        return $this->reactions()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();
    }

    public function getUserReaction(int $userId): ?Reaction
    {
        return $this->reactions()->where('user_id', $userId)->first();
    }

    public function getTotalReactionsCount(): int
    {
        return $this->reactions()->count();
    }
}
