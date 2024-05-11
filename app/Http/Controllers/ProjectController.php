<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Project::query();

        if($request->has('name')){
            $query->where('name','like','%' . $request->input('name') . '%');
        }
        if($request->has('status')){
            $query->where('status',$request->input('status'));
        }

        $projects = $query->paginate(10);
        return response()->json([
            'data'=>$projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => ['required', 'max:255'],
            'image_path' => ['nullable', 'image'],
            "description" => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])]
        ]);
        $data['due_date'] = date('Y-m-d', strtotime($data['due_date']));
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();


        if ($request->hasFile('image_path')) {
            $image = $request->file('image_path');
            $imageName = 'project/image_' . time().'.' . $image->getClientOriginalExtension();
            $image->storeAs('public', $imageName);
            $data['image_path'] = $imageName;
        }
        
        Project::create($data);

        return response()->json([
            'message'=>'Project added successfully!',
            'data'=>$data
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {   
        $project['created_by'] = Auth::user()->name;
        $project['updated_by'] = User::find($project['updated_by'])->name;
        $tasks = $project->tasks()->with('project')->get(); 
        return response()->json([
            'projects'=>$project,
            'tasks'=>$tasks
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {

        $data = $request->validate([
            "name" => ['required', 'max:255'],
            'image_path' => ['nullable', 'image'],
            "description" => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])]
        ]);
        $data['due_date'] = date('Y-m-d', strtotime($data['due_date']));
        $data['updated_by'] = User::find($project['updated_by'])->name;

        if($request->hasFile('image_path')){
            $image = $request->file('image_path');
            $imageName = 'project/image_' . time() . '.' . $image->getClientOriginalExtension(); 
            $imagePath = $image->StoreAs('public',$imageName);

            if($project->image_path){
                Storage::disk('public')->delete($project->image_path);
            }

            $data['image_path'] = $imageName;
        }

        $project->update($data);
        return response()->json([
            'message'=>'Project updated successfully!',
            'data'=>$data
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if($project->image_path){
            Storage::disk('public')->delete($project->image_path);
        }
        $project->delete();
        return response()->json([
            'message'=>'Project Deleted Successfully!'
        ]);
    }
}
