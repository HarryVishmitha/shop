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
use Illuminate\Support\Facades\DB;

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

    public function roles(Request $request)
    {
        $perPage = $request->input('perPage', 10); // Default to 10 per page
        $roles = Role::paginate($perPage);

        // Log roles view activity
        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action_type'=> 'roles_view',
            'description'=> 'Admin viewed roles list with pagination.',
            'ip_address' => request()->ip(),
        ]);

        return Inertia::render('admin/roles', [
            'roles'       => $roles,
            'userDetails' => Auth::user(),
        ]);
    }

    public function storeRole(Request $request)
    {
        // Validate the request with custom messages
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'The role name is required.',
            'name.unique'   => 'This role already exists. Please choose a different name.',
        ]);

        try {
            // Create the role record
            $role = Role::create([
                'name'        => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            if (!$role) {
                throw new \Exception('Failed to create role.');
            }

            // Generate and save a slug for the role
            $role->save();

            // Ensure a valid user ID; if not authenticated, you might set to 0 or handle appropriately.
            $adminId = Auth::id() ?: 0;

            // Log the creation activity
            ActivityLog::create([
                'user_id'     => $adminId,
                'action_type' => 'role_created',
                'description' => 'Admin created a new role: ' . $role->name,
                'ip_address'  => $request->ip(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'Role created successfully.',
                ], 200);
            }
            return back()->with('success', 'Role created successfully.');
        } catch (\Exception $e) {
            Log::error("Error creating role: " . $e->getMessage());
            return back()->withErrors('Failed to create role. Please try again later.');
        }
    }


    public function updateRole(Request $request, $id)
    {
        // Validate the incoming data; ignore the current role when checking for uniqueness.
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:roles,name,' . $id,
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'The role name is required.',
            'name.unique'   => 'This role already exists. Please choose a different name.',
        ]);

        try {
            // Retrieve the role or fail with a 404.
            $role = Role::findOrFail($id);

            // Update the role's fields.
            $role->name = $validated['name'];
            $role->description = $validated['description'] ?? null;

            // Save the changes.
            $role->save();

            // Optionally log this activity.
            $adminId = Auth::id() ?: 0;
            ActivityLog::create([
                'user_id'     => $adminId,
                'action_type' => 'role_updated',
                'description' => 'Admin updated role: ' . $role->name,
                'ip_address'  => $request->ip(),
            ]);

            // Return a JSON response if requested.
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'Role updated successfully.',
                ], 200);
            }

            return back()->with('success', 'Role updated successfully.');
        } catch (\Exception $e) {
            Log::error("Error updating role: " . $e->getMessage());

            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Failed to update role. Please try again later.',
                ], 500);
            }

            return back()->withErrors('Failed to update role. Please try again later.');
        }
    }


    public function deleteRole(Request $request, $id)
    {
        try {
            // Retrieve the role or throw a ModelNotFoundException if it doesn't exist.
            $role = Role::findOrFail($id);
            $roleName = $role->name;

            // Delete the role from the database.
            $role->delete();

            // Log the deletion activity (if using an activity log).
            $adminId = Auth::id() ?: 0;
            ActivityLog::create([
                'user_id'     => $adminId,
                'action_type' => 'role_deleted',
                'description' => 'Admin deleted role: ' . $roleName,
                'ip_address'  => $request->ip(),
            ]);

            // Return a JSON response if requested.
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'success',
                    'message' => 'Role deleted successfully.'
                ], 200);
            }

            // Otherwise, redirect back with a success message.
            return back()->with('success', 'Role deleted successfully.');
        } catch (\Exception $e) {
            // Log the error for debugging.
            Log::error("Error deleting role: " . $e->getMessage());

            // Return a JSON error response if requested.
            if ($request->wantsJson()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Failed to delete role. Please try again later.'
                ], 500);
            }

            // Otherwise, redirect back with an error message.
            return back()->withErrors('Failed to delete role. Please try again later.');
        }
    }

    public function assignRole(Request $request)
    {
        // Get query parameters
        $perPage = $request->input('perPage', 10);
        $search = $request->input('search', '');
        $status = $request->input('status', '');

        // Build the base query with the necessary relationships
        $query = User::with(['role', 'workingGroup']);

        // Apply search filtering if a search term is provided
        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Apply status filtering if a status is provided
        if (!empty($status)) {
            $query->where('status', $status);
        }

        // Retrieve paginated users and append query parameters for pagination links
        $users = $query->paginate($perPage)
                    ->appends($request->query());

        // Retrieve all roles
        $roles = Role::all();

        // Log the activity for viewing the assign roles list
        ActivityLog::create([
            'user_id'     => Auth::id(),
            'action_type' => 'Assign_roles_view',
            'description' => 'Admin viewed assign roles list.',
            'ip_address'  => $request->ip(),
        ]);

        // Render the Inertia view, passing roles, paginated users, and user details.
        return Inertia::render('admin/assignrole', [
            'roles'       => $roles,
            'users'       => $users,
            'userDetails' => Auth::user(),
        ]);
    }

    public function updateUserRole(Request $request)
    {
        // // Optional: Ensure the authenticated user is authorized to update roles.
        // $this->authorize('updateRole', User::class);

        // Validate the incoming request parameters.
        $validated = $request->validate([
            'userId' => 'required|exists:users,id',
            'roleId' => 'required|exists:roles,id',
        ]);

        DB::beginTransaction();

        try {
            // Retrieve the user record.
            $user = User::findOrFail($validated['userId']);
            $oldRoleId = $user->role_id;

            // Check if the new role is different from the current role.
            if ($oldRoleId == $validated['roleId']) {
                return redirect()->back()->with('info', 'User already has the selected role.');
            }

            // Update the user's role.
            $user->role_id = $validated['roleId'];
            $user->save();

            // Log the role update activity with detailed information.
            ActivityLog::create([
                'user_id'     => Auth::id(),
                'action_type' => 'Assign_role_update',
                'description' => "Admin updated role for user: {$user->name} from role id {$oldRoleId} to {$validated['roleId']}",
                'ip_address'  => $request->ip(),
            ]);

            // // Optionally fire an event to handle additional actions (e.g., notifying the user).
            // event(new RoleUpdated($user, $oldRoleId, $validated['roleId']));

            DB::commit();

            return redirect()->back()->with('success', 'User role updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error details for debugging.
            Log::error('Failed to update user role: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Failed to update user role.');
        }
    }

    public function workingGroups(Request $request)
    {
        // Get the per-page value from the query string, defaulting to 10 if not provided.
        $perPage = $request->query('perPage', 10);
        // Optionally filter by status if provided.
        $status = $request->query('status');

        // Build the query with the count of related users.
        $query = WorkingGroup::withCount('users');

        if ($status) {
            $query->where('status', $status);
        }

        // Optionally order by created_at descending.
        $query->orderBy('created_at', 'desc');

        // Retrieve paginated results and append existing query parameters to pagination links.
        $workingGroups = $query->paginate($perPage)->withQueryString();

        // Log the activity.
        ActivityLog::create([
            'user_id'     => Auth::id(),
            'action_type' => 'working_groups_view',
            'description' => 'Admin viewed working groups list.',
            'ip_address'  => $request->ip(),
        ]);

        // Render the Inertia view, passing paginated working groups and user details.
        return Inertia::render('admin/workingGroups', [
            'userDetails'   => Auth::user(),
            'workingGroups' => $workingGroups,
        ]);
    }


}
