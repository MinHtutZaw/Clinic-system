<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Visit;



class Patient extends Model
{

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
            switch ($age) {
                case '<40':
                    $query->where('age', '<', 40);
                    break;
                case '40-50':
                    $query->whereBetween('age', [40, 50]);
                    break;
                case '50-60':
                    $query->whereBetween('age', [50, 60]);
                    break;
                case '>60':
                    $query->where('age', '>', 60);
                    break;
            }
        });
    }


    public function records()
    {
        return $this->hasMany(Record::class);
    }
    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
