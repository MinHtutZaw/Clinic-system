<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'visit_at',
        'weight_kg',
        'oxygen_saturation',
        'bp_systolic',
        'bp_diastolic',
        'diabetes',
        'notes',
    ];

    protected $casts = [
        'visit_at' => 'datetime',

    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
