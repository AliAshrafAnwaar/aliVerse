<?php

namespace Tests\Feature\Admin;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SkillTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
    }

    private function regular(): User
    {
        return User::factory()->create(['role' => 'user', 'email_verified_at' => now()]);
    }

    public function test_admin_can_list_skills(): void
    {
        Skill::factory()->count(3)->create();

        $response = $this->actingAs($this->admin())->get(route('admin.skills.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Skills/Index')
            ->has('skills.data', 3));
    }

    public function test_admin_can_create_skill(): void
    {
        $response = $this->actingAs($this->admin())->post(route('admin.skills.store'), [
            'name'              => 'Docker',
            'category'          => 'tools',
            'proficiency_level' => 7,
            'is_featured'       => true,
            'sort_order'        => 0,
        ]);

        $response->assertRedirect(route('admin.skills.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('skills', ['name' => 'Docker', 'category' => 'tools']);
    }

    public function test_admin_can_update_skill(): void
    {
        $skill = Skill::factory()->create(['name' => 'Old Name']);

        $response = $this->actingAs($this->admin())->put(route('admin.skills.update', $skill), [
            'name'              => 'New Name',
            'category'          => $skill->category,
            'proficiency_level' => 6,
        ]);

        $response->assertRedirect(route('admin.skills.index'));
        $this->assertDatabaseHas('skills', ['id' => $skill->id, 'name' => 'New Name', 'proficiency_level' => 6]);
    }

    public function test_admin_can_delete_skill(): void
    {
        $skill = Skill::factory()->create();

        $response = $this->actingAs($this->admin())->delete(route('admin.skills.destroy', $skill));

        $response->assertRedirect(route('admin.skills.index'));
        $this->assertDatabaseMissing('skills', ['id' => $skill->id]);
    }

    public function test_non_admin_cannot_create_skill(): void
    {
        $response = $this->actingAs($this->regular())->post(route('admin.skills.store'), [
            'name'              => 'Blocked',
            'category'          => 'tools',
            'proficiency_level' => 5,
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('skills', ['name' => 'Blocked']);
    }

    public function test_guest_cannot_access_admin_skills(): void
    {
        $this->get(route('admin.skills.index'))->assertRedirect(route('login'));
    }

    public function test_store_requires_name_and_category(): void
    {
        $response = $this->actingAs($this->admin())
            ->from(route('admin.skills.create'))
            ->post(route('admin.skills.store'), [
                'proficiency_level' => 5,
            ]);

        $response->assertSessionHasErrors(['name', 'category']);
    }

    public function test_store_rejects_duplicate_name(): void
    {
        Skill::factory()->create(['name' => 'Duplicate']);

        $response = $this->actingAs($this->admin())
            ->from(route('admin.skills.create'))
            ->post(route('admin.skills.store'), [
                'name'              => 'Duplicate',
                'category'          => 'tools',
                'proficiency_level' => 5,
            ]);

        $response->assertSessionHasErrors('name');
    }
}
