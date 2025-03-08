<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
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

    public function updateProfile()
    {
        
    }
    
}
