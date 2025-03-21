<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;
use App\Models\WorkingGroup;
use App\Models\DailyCustomer;


class AdminController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }

    public function index() {
        // Get total number of users
        $totalUsers = User::count();
        $adminUsers = User::where('role_id', Role::where('name', 'admin')->first()->id)->count();
        $userUsers = User::where('role_id', Role::where('name', 'user')->first()->id)->count();
        $workingGroups = WorkingGroup::count();
        $dailyCustomers = DailyCustomer::count();

        return Inertia::render('admin/dashboard', [
            'totalUsers' => $totalUsers,
            'adminUsers' => $adminUsers,
            'userUsers' => $userUsers,
            'workingGroups' => $workingGroups,
            'userDetails' => Auth::user(),
            'dailyCustomers' => $dailyCustomers
        ]);
    }

    public function profile() {
        $user = Auth::user();
        $userDetails = User::with(['role', 'workingGroup'])->find($user->id);

        return Inertia::render('admin/profile', [
            'userDetails' => $userDetails,
        ]);
    }

    public function users(Request $request) {
        $perPage = $request->input('perPage', 10); // Get the perPage value from the request, defaulting to 10
        $status = $request->input('status'); // Get the status filter from the request

        // Query the users, including the role and working group relationships
        $query = User::with(['role', 'workingGroup']);

        // If a status filter is provided, apply it
        if ($status) {
            $query->where('status', $status);
        }

        // Paginate the results with the specified perPage value
        $users = $query->paginate($perPage);

        return Inertia::render('admin/users', [
            'users' => $users,
            'userDetails' => Auth::user(),
            'status' => $status // Pass the selected status to the frontend for persistence
        ]);
    }

    public function updateProfile(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'phone_number' => 'required|string|max:20',
            'description' => 'nullable|string|max:1000',
            'newPassword' => 'nullable|min:6|confirmed',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Validate the profile image
        ]);

        // Get the authenticated user
        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Update the user's profile information
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone_number = $validated['phone_number'] ?? $user->phone_number;
        // $user->description = $validated['description'] ?? $user->description;
        Log::info('hi');
        // If a new password is provided, hash and update it
        if (!empty($validated['newPassword'])) {
            $user->password = Hash::make($validated['newPassword']);
        }

        // Handle profile picture upload if provided
        if ($request->hasFile('profile_picture')) {
            // Check if the user has a profile picture and delete it if it exists
            if ($user->profile_picture && file_exists(public_path('images/users/' . basename($user->profile_picture)))) {
                // Delete the old profile picture from the public images directory
                unlink(public_path('images/users/' . basename($user->profile_picture)));
            }

            // Handle the new profile picture upload
            $image = $request->file('profile_picture');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();  // Unique image name
            $image->move(public_path('images/users'), $imageName);  // Store image in public/images/users

            // Save the path to the user's profile picture
            $user->profile_picture = '/images/users/' . $imageName;
        }



        // Save the updated user data
        if ($user->save()) {
            return response()->json(['success' => 'Profile updated successfully!'], 200);
        } else {
            return response()->json(['error' => 'Failed to update profile'], 500);
        }
    }

    public function editUser($userId)
    {
        $user = Auth::user();
        $userDetails = User::with(['role', 'workingGroup'])->find($user->id);
        $selectedUser = User::with(['role', 'workingGroup'])->find($userId);
        return Inertia::render('admin/useredit', [
            'userDetails' => $userDetails,
            'selectedUser' => $selectedUser,
            'selectedID' => $userId,
        ]);
    }

    public function updateUser(Request $request, $userID)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $userID . ',id',
            'phone_number' => 'required|string|max:20',
            'description' => 'nullable|string|max:1000',
            'newPassword' => 'nullable|string|min:6|confirmed',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = User::find($userID);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone_number = $validated['phone_number'] ?? $user->phone_number;
        $user->description = $validated['description'] ?? $user->description;

        if (!empty($validated['newPassword'])) {
            $user->password = Hash::make($validated['newPassword']);
        }

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture && file_exists(public_path('images/users/' . basename($user->profile_picture)))) {
                unlink(public_path('images/users/' . basename($user->profile_picture)));
            }

            $image = $request->file('profile_picture');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/users'), $imageName);
            $user->profile_picture = '/images/users/' . $imageName;
        }

        if ($user->save()) {
            return response()->json(['success' => 'User updated successfully!'], 200);
        } else {
            return response()->json(['error' => 'Failed to update user'], 500);
        }
    }



}
