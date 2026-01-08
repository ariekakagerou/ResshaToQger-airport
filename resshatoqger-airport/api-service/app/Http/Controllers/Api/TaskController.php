<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Get tasks assigned to the current logged-in user
    public function myTasks(Request $request)
    {
        $tasks = Task::where('assigned_to', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
        return response()->json(['data' => $tasks]);
    }

    // Get all tasks (Super Admin Only)
    public function index()
    {
        $tasks = Task::with(['assignee', 'creator'])->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $tasks]);
    }

    // Create a new task (Super Admin Only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:users,id',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date'
        ]);

        $task = Task::create([
            ...$validated,
            'created_by' => $request->user()->id,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Task created successfully', 'data' => $task], 201);
    }

    // Update task status (Assignee can do this)
    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        // Ensure user owns the task or is super admin
        if ($task->assigned_to !== $request->user()->id && $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed'
        ]);

        $task->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Status updated', 'data' => $task]);
    }

    // Helper to get list of potential assignees (admins/operators/cs)
    public function getAssignees()
    {
        $users = User::whereIn('role', ['admin', 'operator', 'cs'])->get(['id', 'name', 'role']);
        return response()->json(['data' => $users]);
    }
}
