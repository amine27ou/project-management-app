<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as RulesPassword;

class ProfileController extends Controller
{
    
    public function update(Request $request)
    {
        $user = User::find(Auth::user()->id);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'current_password'=>'required',
            "new_password" => [
                "required",
                
                RulesPassword::min(8)->letters()->symbols(),
            ]
        ]);
        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json([
                'error' => 'Current password is incorrect.'
            ], 422);
        }
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['new_password']);
        $user->save();
    
        return response()->json([
            'message' => 'Password updated successfully.'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
   

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::guard('web')->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
