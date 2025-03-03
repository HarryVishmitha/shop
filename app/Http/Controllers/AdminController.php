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
            'dailyCustomers' => $dailyCustomers
        ]);
    }
    public function users() {
        $users = User::all();
        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }
}
