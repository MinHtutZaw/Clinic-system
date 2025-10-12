<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
      protected $fillable = [
        'name',
        'service_price',
    ];

    // A service can belong to many products
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_service')
                    ->withTimestamps();
    }
}
