<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitController extends Controller
{
    // List all visits for one patient (history)
    public function index(Patient $patient)
    {
        $visits = $patient->visits()
            ->latest('visit_at')
            ->get();

        return Inertia::render('Visits/Index', [
            'patient' => $patient,
            'visits'  => $visits,
        ]);
    }

    // Show form to create a new visit
    public function create(Patient $patient)
    {
        return Inertia::render('Visits/Create', [
            'patient' => $patient,
        ]);
    }

    // Store new visit
    public function store(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'visit_at'            => ['nullable', 'date'],
            'weight_kg'           => ['required', 'numeric', 'min:0'],
            'oxygen_saturation'   => ['required', 'integer', 'min:0', 'max:100'],
            'bp_systolic'         => ['required', 'integer', 'min:0'],
            'bp_diastolic'        => ['required', 'integer', 'min:0'],
            
            'diabetes'            => ['nullable', 'numeric', 'min:0'],
            'notes'               => ['nullable', 'string'],
        ]);

        $data['patient_id'] = $patient->id;

        if (empty($data['visit_at'])) {
            $data['visit_at'] = now();
        }


        Visit::create($data);

        return redirect()
            ->route('patients.visits.index', $patient->id)
            ->with('message', 'Visit recorded successfully.');
    }
}
