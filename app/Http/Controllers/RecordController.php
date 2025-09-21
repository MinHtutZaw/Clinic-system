<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Product;
use App\Models\Record;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $records = Record::with(['patient', 'product'])
            ->search($request->input('search'))
            ->orderBy('created_at', 'desc')
            ->paginate(2)
            ->withQueryString();

        return inertia('Records/Index', [
            'records' => $records,
            'filters' => $request->only('search'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Records/Create', [
            'patients' => Patient::all(['id', 'name', 'free_trials']),
            'products' => Product::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'product_id' => 'required|exists:products,id',
            'duration'   => 'required|integer',
        ]);

        $patient = Patient::findOrFail($request->patient_id);
        $product = Product::findOrFail($request->product_id);

        // Determine the actual price to charge
        if ($patient->free_trials > 0) {
            $price = 0.00; // Free treatment
            $patient->decrement('free_trials');
        } else {
            // Use product price as default, but allow custom pricing if needed
            $price = $request->filled('price') ? (float)$request->price : $product->price;
        }

        Record::create([
            'patient_id' => $patient->id,
            'product_id' => $product->id,
            'duration'   => $request->duration,
            'price'      => $price, // This is what the patient actually paid
        ]);

        return redirect()->route('records.index')->with('message', 'Record saved successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Record $record)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Record $record)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Record $record)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Record $record)
    {
        $record->delete();
        return back()->with('success', 'Record deleted successfully.');
    }
}
