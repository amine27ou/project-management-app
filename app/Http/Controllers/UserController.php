<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if($request->has('name')){
            $query->where('name','like','%'.$request->input('name').'%');
        }
        if($request->has('email')){
            $query->where('name','like','%'.$request->input('email').'%');
        }

        $users = $query->paginate(10); 

        return response()->json([
            'data'=>$users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "string", "email", "unique:users,email"],
            "password" => [
                "required",
                'confirmed',
                Password::min(8)->letters()->symbols(),
            ],
        ]);
        $data['email_verified_at'] = time();
        $data['password'] = Hash::make($data['password']);
        User::create($data);
        return response()->json([
            'message'=>'user created successfully!'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $cachedUser = Cache::remember('user_' . $user->id, 30, function () use ($user) {
            return $user;
        });
    
        return response()->json([
            'user' => $cachedUser,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            "name" => ["required", "string", "max:255"],
            "email" => [
                "required",
                "email",
                Rule::unique('users')->ignore($user->id),
            ],
            "password" => [
                'nullable',
                'confirmed',
                Password::min(8)->letters()->symbols(),
            ],
        ]);
        if ($user->password) {
            $data['password'] = Hash::make($user->password);
        } else {
            unset($data['password']);
        }
        $user->update($data);

        return response()->json([
            'message'=>'User updated successfully!',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'message'=>'User deleted successfully!',
        ]);
    }
}
