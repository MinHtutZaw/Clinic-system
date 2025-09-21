<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
{
    $patients = Patient::orderBy('id', 'desc')
        ->filter($request->only(['search', 'town', 'age']))
        ->paginate(2)
        ->withQueryString();

    // Get all unique towns and ages for filter dropdowns
    $allTowns = Patient::select('town')->distinct()->pluck('town');
    $allAges = Patient::select('age')->distinct()->pluck('age');

    return Inertia::render('Patients/index', [
        'patients' => $patients,
        'allTowns' => $allTowns,
        'allAges' => $allAges,
    ]);
}
    public function create()
    {
        return Inertia::render('Patients/create');
    }

    public function store(Request $request)
    {

        $validated = $request->validate(
            [
                'name'    => 'required|string|max:255',
                'phone'   => 'required|string|max:20',
                'town' => ['required', 'string', 'max:255', 'regex:/^[A-Za-z\s,.-]+$/'],
                'age'     => 'required|integer|min:0|max:120',
            ]
        );
        Patient::create($validated);
        return redirect()->route('patients.index')->with('message', 'Data is added successfully.');
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();
        return redirect()->route('patients.index')->with('message', 'Data is deleted successfully.');
    }

    public function edit(Patient $patient)
    {

        return Inertia::render('Patients/edit', compact('patient'));
    }

    public function update(Request $request, Patient $patient)
    {

        $validated = $request->validate(
            [
                'name'    => 'required|string|max:255',
                'phone'   => 'required|string|max:20',
                'town' => ['required', 'string', 'max:255', 'regex:/^[A-Za-z\s,.-]+$/'],
                'age'     => 'required|integer|min:0|max:120',
            ]
        );
        $patient->update(
            [
                'name' => $request->input('name'),
                'phone' => $request->input('phone'),
                'town' => $request->input('town'),
                'age' => $request->input('age'),
            ]
        );

        return redirect()->route('patients.index')->with('message', 'Data is updated successfully.');
    }
}
