<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();

            // Relationship
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();

            // Vitals
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->unsignedTinyInteger('oxygen_saturation')->nullable(); // 0–100

            $table->unsignedSmallInteger('bp_systolic')->nullable();
            $table->unsignedSmallInteger('bp_diastolic')->nullable();
            
            // Diabetes 
            $table->decimal('diabetes', 6, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('visit_at')->useCurrent();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
