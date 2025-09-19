<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    /** @use HasFactory<\Database\Factories\RecordFactory> */
    use HasFactory;
      protected $fillable = [
        'patient_id',
        'product_id',
        'duration',
        'price',
       
    ];


    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
