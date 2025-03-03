<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;


class AdminController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }

    public function index() {
        // Get total number of users
        $totalUsers = User::count();

        return Inertia::render('admin/dashboard', [
            'totalUsers' => $totalUsers
        ]);
    }
}
