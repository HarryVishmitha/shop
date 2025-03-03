<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id', 'role', 'message', 'status'];

    public function admins()
    {
        return $this->belongsToMany(User::class, 'admin_notifications');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
