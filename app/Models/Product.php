<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
        'duration',
        'description',
        // add other columns here
    ];
    public function services()
    {
        return $this->belongsToMany(Service::class, 'product_service')
            ->withTimestamps();
    }

    public function records()
    {
        return $this->hasMany(Record::class);
    }
}
