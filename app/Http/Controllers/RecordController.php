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
            ->paginate(10)
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
            'voucher'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $patient = Patient::findOrFail($request->patient_id);
        $product = Product::findOrFail($request->product_id);

        $price = 0.00; // default
        $status = 'Paid'; // default status

        // If patient role is VVIP
        if (strtolower($patient->role) === 'vvip') {
            $price = 0.00;
            $status = 'VVIP';
        }
        // If free trials are available → mark Trial
        elseif ($patient->free_trials > 0) {
            $price = 0.00;
            $status = 'Trial';
            $patient->free_trials -= 1;
            $patient->save();
        } else {
            $price = $request->filled('price')
                ? (float) $request->price
                : (float) $product->price;
            $status = 'Paid';
        }

        // Handle voucher upload
        $voucherPath = null;
        if ($request->hasFile('voucher')) {
            $voucherPath = $request->file('voucher')->store('vouchers', 'public');
        }

        Record::create([
            'patient_id'   => $patient->id,
            'product_id'   => $product->id,
            'duration'     => $request->duration,
            'price'        => $price,
            'status'       => $status,        // Auto classified status
            'voucher_path' => $voucherPath,   // Save voucher path
        ]);

        return redirect()
            ->route('records.index')
            ->with('message', 'Record saved successfully.');
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
