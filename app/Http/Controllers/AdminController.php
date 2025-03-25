<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\WorkingGroup;
use App\Models\DailyCustomer;
use App\Models\ActivityLog;

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

        // Log dashboard access activity
        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action_type'=> 'dashboard_access',
            'description'=> 'Admin accessed dashboard.',
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('admin/dashboard', [
            'totalUsers'     => $totalUsers,
            'adminUsers'     => $adminUsers,
            'userUsers'      => $userUsers,
            'workingGroups'  => $workingGroups,
            'userDetails'    => Auth::user(),
            'dailyCustomers' => $dailyCustomers
        ]);
    }

    public function profile() {
        $user = Auth::user();
        $userDetails = User::with(['role', 'workingGroup'])->find($user->id);

        // Log profile view activity
        ActivityLog::create([
            'user_id'    => $user->id,
            'action_type'=> 'profile_view',
            'description'=> 'Admin viewed profile.',
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('admin/profile', [
            'userDetails' => $userDetails,
        ]);
    }

    public function users(Request $request) {
        $perPage = $request->input('perPage', 10); // Default to 10 per page
        $status = $request->input('status'); // Optional status filter

        $query = User::with(['role', 'workingGroup']);

        if ($status) {
            $query->where('status', $status);
        }

        $users = $query->paginate($perPage);
        $workingGroups = WorkingGroup::all();

        // Log user list view activity
        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action_type'=> 'users_list_view',
            'description'=> 'Admin viewed user list with filter status: ' . ($status ?? 'none'),
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('admin/users', [
            'users'        => $users,
            'userDetails'  => Auth::user(),
            'workingGroups'=> $workingGroups,
            'status'       => $status
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'phone_number'    => 'required|string|max:20',
            'description'     => 'nullable|string|max:1000',
            'newPassword'     => 'nullable|min:6|confirmed',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = User::find(Auth::id());
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Update profile details
        $user->name         = $validated['name'];
        $user->email        = $validated['email'];
        $user->phone_number = $validated['phone_number'] ?? $user->phone_number;

        if (!empty($validated['newPassword'])) {
            $user->password = Hash::make($validated['newPassword']);
        }

        // Handle profile picture upload if provided
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
            // Log profile update activity
            ActivityLog::create([
                'user_id'    => $user->id,
                'action_type'=> 'profile_update',
                'description'=> 'User updated profile successfully.',
                'ip_address' => request()->ip(),
            ]);
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

        // Log edit user view activity
        ActivityLog::create([
            'user_id'    => $user->id,
            'action_type'=> 'edit_user_view',
            'description'=> 'Admin is viewing edit form for user ID: ' . $userId,
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('admin/useredit', [
            'userDetails'  => $userDetails,
            'selectedUser' => $selectedUser,
            'selectedID'   => $userId,
        ]);
    }

    public function updateUser(Request $request, $userID)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|max:255|unique:users,email,' . $userID . ',id',
            'phone_number'    => 'required|string|max:20',
            'description'     => 'nullable|string|max:1000',
            'newPassword'     => 'nullable|string|min:6|confirmed',
            'profile_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = User::find($userID);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update user details
        $user->name         = $validated['name'];
        $user->email        = $validated['email'];
        $user->phone_number = $validated['phone_number'] ?? $user->phone_number;
        $user->description  = $validated['description'] ?? $user->description;

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
            // Log user update activity
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action_type'=> 'user_update',
                'description'=> 'Admin updated user ID: ' . $userID,
                'ip_address' => request()->ip(),
            ]);
            return response()->json(['success' => 'User updated successfully!'], 200);
        } else {
            return response()->json(['error' => 'Failed to update user'], 500);
        }
    }

    public function assignWorkingGroup(Request $request, $id)
    {
        $validatedData = $request->validate([
            'working_group_id' => 'nullable|exists:working_groups,id',
        ]);

        $user = User::findOrFail($id);

        if ($user->working_group_id == $validatedData['working_group_id']) {
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'info',
                    'message' => 'No changes detected in working group assignment.',
                ], 200);
            }
            return back()->with('info', 'No changes detected in working group assignment.');
        }

        try {
            $oldGroupId = $user->working_group_id;
            $user->update([
                'working_group_id' => $validatedData['working_group_id']
            ]);

            // Log working group update activity
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action_type'=> 'working_group_update',
                'description'=> 'Updated working group for user ID: ' . $id . ' from group ' . ($oldGroupId ?? 'none') . ' to group ' . ($validatedData['working_group_id'] ?? 'none'),
                'ip_address' => request()->ip(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'Working group updated successfully.',
                    'user'    => $user,
                ], 200);
            }

            return back()->with('success', 'Working group updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating working group for user ID ' . $user->id . ': ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Failed to update working group. Please try again later.',
                ], 500);
            }
            return back()->withErrors('Failed to update working group. Please try again later.');
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validatedData = $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $user = User::findOrFail($id);

        if ($user->status == $validatedData['status']) {
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'info',
                    'message' => 'No changes detected in status assignment.',
                ], 200);
            }
            return back()->with('info', 'No changes detected in status assignment.');
        }

        try {
            $oldStatus = $user->status;
            $user->update([
                'status' => $validatedData['status']
            ]);

            // Log status update activity
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action_type'=> 'status_update',
                'description'=> 'Updated status for user ID: ' . $id . ' from ' . $oldStatus . ' to ' . $validatedData['status'],
                'ip_address' => request()->ip(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'User status updated successfully.',
                    'user'    => $user,
                ], 200);
            }
            return back()->with('success', 'User status updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating status for user ID ' . $user->id . ': ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Failed to update user status. Please try again later.',
                ], 500);
            }
            return back()->withErrors('Failed to update user status. Please try again later.');
        }
    }

    public function deleteUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            // Log deletion activity
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action_type'=> 'user_deletion',
                'description'=> 'Admin deleted user ID: ' . $id,
                'ip_address' => request()->ip(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'User deleted successfully.',
                ], 200);
            }

            return back()->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            Log::error("Error deleting user ID $id: " . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Failed to delete user. Please try again later.',
                ], 500);
            }
            return back()->withErrors('Failed to delete user. Please try again later.');
        }
    }

    public function roles()
    {
        $roles = Role::all();

        // Log roles view activity
        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action_type'=> 'roles_view',
            'description'=> 'Admin viewed roles list.',
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('admin/roles', [
            'roles'       => $roles,
            'userDetails' => Auth::user(),
        ]);
    }

    public function storeRole(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'        => 'required|string|max:255|unique:roles,name',
                'description' => 'nullable|string|max:1000',
            ], [
                'name.required'        => 'Role name is required.',
                'name.string'          => 'Role name must be a string.',
                'name.max'             => 'Role name cannot exceed 255 characters.',
                'name.unique'          => 'This role name already exists.',
                'description.string'   => 'Description must be a string.',
                'description.max'      => 'Description cannot exceed 1000 characters.',
            ]);

            $role = Role::create([
                'name'        => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            // Log role creation activity
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action_type'=> 'role_creation',
                'description'=> 'Admin created a new role: ' . $role->name,
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'success' => 'Role created successfully!',
                'role'    => $role
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed.',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error creating role: " . $e->getMessage());
            return response()->json(['error' => 'Failed to create role. Please try again later.'], 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name'        => 'required|string|max:255|unique:roles,name,' . $id,
                'description' => 'nullable|string|max:1000',
            ], [
                'name.required'        => 'Role name is required.',
                'name.string'          => 'Role name must be a string.',
                'name.max'             => 'Role name cannot exceed 255 characters.',
                'name.unique'          => 'This role name already exists.',
                'description.string'   => 'Description must be a string.',
                'description.max'      => 'Description cannot exceed 1000 characters.',
            ]);

            $role = Role::findOrFail($id);

            // Store old data for logging purposes
            $oldData = $role->getOriginal();

            $role->name        = $validated['name'];
            $role->description = $validated['description'] ?? null;

            if ($role->save()) {
                // Log role update activity with old and new values
                ActivityLog::create([
                    'user_id'    => Auth::id(),
                    'action_type'=> 'role_update',
                    'description'=> 'Admin updated role ID: ' . $id . 
                                    '. Old Name: ' . $oldData['name'] . ', New Name: ' . $role->name,
                    'ip_address' => $request->ip(),
                ]);

                return response()->json([
                    'success' => 'Role updated successfully!',
                    'role'    => $role
                ], 200);
            } else {
                return response()->json(['error' => 'Failed to update role.'], 500);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed.',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error updating role ID $id: " . $e->getMessage());
            return response()->json(['error' => 'Failed to update role. Please try again later.'], 500);
        }
    }

    public function deleteRole(Request $request, $id)
    {
        try {
            $role = Role::findOrFail($id);

            // Store role name for logging purposes
            $roleName = $role->name;

            $role->delete();

            // Log role deletion activity
            ActivityLog::create([
                'user_id'    => Auth::id(),
                'action_type'=> 'role_deletion',
                'description'=> 'Admin deleted role ID: ' . $id . ', Role Name: ' . $roleName,
                'ip_address' => $request->ip(),
            ]);

            return response()->json(['success' => 'Role deleted successfully!'], 200);

        } catch (\Exception $e) {
            Log::error("Error deleting role ID $id: " . $e->getMessage());
            return response()->json(['error' => 'Failed to delete role. Please try again later.'], 500);
        }
    }

}