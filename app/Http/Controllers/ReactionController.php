<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReactionController extends Controller
{
    /**
     * Add or update a reaction
     */
    public function store(Request $request)
    {
        $request->validate([
            'reactable_type' => 'required|string',
            'reactable_id' => 'required|integer',
            'type' => 'required|string|in:like,love,celebrate,support',
        ]);

        $userId = Auth::id();
        
        // Check if user already reacted
        $existingReaction = Reaction::where('user_id', $userId)
            ->where('reactable_type', $request->reactable_type)
            ->where('reactable_id', $request->reactable_id)
            ->first();

        if ($existingReaction) {
            // If same type, remove reaction (toggle off)
            if ($existingReaction->type === $request->type) {
                $existingReaction->delete();
                return back()->with('success', 'Reaction removed');
            }
            
            // Otherwise, update reaction type
            $existingReaction->update(['type' => $request->type]);
            return back()->with('success', 'Reaction updated');
        }

        // Create new reaction
        Reaction::create([
            'user_id' => $userId,
            'reactable_type' => $request->reactable_type,
            'reactable_id' => $request->reactable_id,
            'type' => $request->type,
        ]);

        return back()->with('success', 'Reaction added');
    }

    /**
     * Remove a reaction
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'reactable_type' => 'required|string',
            'reactable_id' => 'required|integer',
        ]);

        $userId = Auth::id();
        
        Reaction::where('user_id', $userId)
            ->where('reactable_type', $request->reactable_type)
            ->where('reactable_id', $request->reactable_id)
            ->delete();

        return back()->with('success', 'Reaction removed');
    }

    /**
     * Get reactions for a specific item (API endpoint)
     */
    public function index(Request $request)
    {
        $request->validate([
            'reactable_type' => 'required|string',
            'reactable_id' => 'required|integer',
        ]);

        $reactions = Reaction::where('reactable_type', $request->reactable_type)
            ->where('reactable_id', $request->reactable_id)
            ->with('user:id,name')
            ->get();

        $grouped = $reactions->groupBy('type')->map(function ($items) {
            return [
                'count' => $items->count(),
                'users' => $items->pluck('user'),
            ];
        });

        return response()->json($grouped);
    }
}
