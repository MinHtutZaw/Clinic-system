<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'phone',
        'town',
        'age',
        'role',
    ];


    // Filter scope
    public function scopeFilter($query, $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where('name', 'LIKE', "%{$search}%");
        });

        $query->when($filters['town'] ?? false, function ($query, $town) {
            $query->where('town', $town);
        });

        $query->when($filters['age'] ?? false, function ($query, $age) {
            $query->where('age', $age);
        });
    }


    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
