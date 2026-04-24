<?php

namespace App\Policies;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SkillPolicy
{
    use HandlesAuthorization;

    /**
     * Skills are public content: anyone (guest included) can list and view.
     * Write operations are admin-only.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Skill $skill): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Skill $skill): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Skill $skill): bool
    {
        return $user->isAdmin();
    }

    public function feature(User $user, Skill $skill): bool
    {
        return $user->isAdmin();
    }
}
