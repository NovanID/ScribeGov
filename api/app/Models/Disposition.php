<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disposition extends Model
{
    protected $guarded = [];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function letter()
    {
        return $this->belongsTo(Letter::class);
    }
}
