<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Notifications\CustomVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'working_group_id',  // New field
        'status',             // New field
        'phone_number',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'working_group_id' => 'integer', // Ensure it's cast as an integer
            'status' => 'string', 
        ];
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);  // Use the custom notification
    }
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Define the relationship with the WorkingGroup model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workingGroup()
    {
        return $this->belongsTo(WorkingGroup::class);
    }
}
