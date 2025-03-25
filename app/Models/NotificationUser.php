<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class NotificationUser extends Pivot
{
    protected $table = 'notification_user';

    protected $fillable = [
        'notification_id',
        'user_id',
        'status',
        'read_at',
    ];
}
