<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = Task::query();

    if ($request->has('name')) {
        $query->where("name", "like", "%" . $request->input('name') . "%");
    }
    if ($request->has('status')) {
        $query->where("status", $request->input('status'));
    }
    $tasks = $query->paginate(10);
    foreach ($tasks as $task) {
        $task->created_by = User::find($task->created_by)->name;
        $task->project_name = Project::find($task->project_id)->name;
    }
    return response()->json([
        'tasks' => $tasks
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => ['required', 'max:255'],
            'image' => ['nullable', 'image'],
            "description" => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'project_id' => ['required', 'exists:projects,id'],
            'assigned_user_id' => ['required', 'exists:users,id'],
            'status' => [
                'required',
                Rule::in(['pending', 'in_progress', 'completed'])
            ],
            'priority' => [
                'required',
                Rule::in(['low', 'medium', 'high'])
            ]
        ]);
        $data['due_date'] = date('Y-m-d', strtotime($data['due_date']));
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if($request->hasFile('image_path')){
            $image = $request->file('image_path');
            $imageName = 'task/image_' . time().'.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('public',$imageName);
            $data['image_path'] = $imageName;
        }
        Task::create($data);

        return response()->json([
            'message'=>'Task added successfully!',
            'data'=>$data
        ]);

        
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {   
        $task->created_by = User::find($task->created_by)->name;
        $task->updated_by = User::find($task->updated_by)->name;
        return response()->json([
            "task"=>$task
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {

        $data = $request->validate([
            "name" => ['required', 'max:255'],
            'image' => ['nullable', 'image'],
            "description" => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'project_id' => ['required', 'exists:projects,id'],
            'assigned_user_id' => ['required', 'exists:users,id'],
            'status' => [
                'required',
                Rule::in(['pending', 'in_progress', 'completed'])
            ],
            'priority' => [
                'required',
                Rule::in(['low', 'medium', 'high'])
            ]
        ]);

        $data['due_date'] = date('Y-m-d', strtotime($data['due_date']));
        $data['updated_by'] = Auth::id();

        if($request->hasFile('image_path')){
            $image = $request->file('image_path');
            $imageName = 'task/image_' . time() . '.' . $image->getClientOriginalExtension(); 
            $imagePath = $image->StoreAs('public',$imageName);

            if($task->image_path){
                Storage::disk('public')->delete($task->image_path);
            }

            $data['image_path'] = $imageName;
        }

        $task->update($data);

        return response()->json([
            'message'=>'Task updated successfully!',
            'data'=>$task
        ]);
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
{
    if ($task->image_path) {
        if (Storage::disk('public')->exists($task->image_path)) {
            Storage::disk('public')->delete($task->image_path);
        }
    }

    $task->delete();

    return response()->json([
        'message' => 'Task Deleted Successfully!'
    ]);
}

    public function myTasks(Request $request)
    {   
    
        $user = Auth::user(); 
        $query = Task::query()->where('assigned_user_id',$user->id);

        if ($request->has('name')) {
            $query->where("name", "like", "%" . $request->input('name') . "%");
        }
        if ($request->has('status')) {
            $query->where("status", $request->input('status'));
        }

        $tasks = $query->paginate(10);
        foreach ($tasks as $task) {
            $task->created_by = User::find($task->created_by)->name;
            $task->project_name = Project::find($task->project_id)->name;
        }
        return response()->json([
            'tasks' => $tasks
        ]);
    }
}
