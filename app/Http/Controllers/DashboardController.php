<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    public function index()
    {
        $user = Auth::user();
        $my_pending_tasks = Task::query()
            ->where('status','pending')
            ->where('assigned_user_id',$user->id)
            ->count();
        $total_pending_tasks = Task::query()
        ->where('status','pending')
        ->count();
        
        $my_in_progress_tasks = Task::query()
            ->where('status','in_progress')
            ->where('assigned_user_id',$user->id)
            ->count();
        $total_in_progress_tasks = Task::query()
        ->where('status','in_progress')
        ->count();
        
        $my_completed_tasks = Task::query()
            ->where('status','completed')
            ->where('assigned_user_id',$user->id)
            ->count();
        $total_completed_tasks = Task::query()
        ->where('status','completed')
        ->count();

        $activeTasks = Task::query()
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_user_id', $user->id)
            ->limit(10)
            ->get();
        
            return response()->json([
                'my_pending_tasks' => $my_pending_tasks,
                'total_pending_tasks' => $total_pending_tasks,
                'my_in_progress_tasks' => $my_in_progress_tasks,
                'total_in_progress_tasks' => $total_in_progress_tasks,
                'my_completed_tasks' => $my_completed_tasks,
                'total_completed_tasks' => $total_completed_tasks,
                'active_tasks' => $activeTasks,
            ]);
        
    }
}
