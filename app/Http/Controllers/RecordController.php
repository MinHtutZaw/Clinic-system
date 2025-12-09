<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Product;
use App\Models\Record;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        $records = Record::with(['patient', 'products', 'services'])
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
            'products' => Product::all(['id', 'name', 'price']),
            'services' => Service::all(['id', 'name', 'service_price']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
            'duration' => 'required|integer',
        ]);

        $patient = Patient::findOrFail($request->patient_id);

        $status = 'Paid';
        $totalPrice = 0.00;

        // Handle free trial
        if ($patient->free_trials > 0) {
            $status = 'Trial';
            $totalPrice = 0.00;
            $patient->free_trials -= 1;
            $patient->save();
        } else {
            // Calculate total price for non-trial patients
            foreach ($request->product_ids as $productId) {
                $product = Product::findOrFail($productId);
                $totalPrice += $product->price;
            }

            if (!empty($request->service_ids)) {
                foreach ($request->service_ids as $serviceId) {
                    $service = Service::findOrFail($serviceId);
                    $totalPrice += $service->service_price;
                }
            }
        }

        // Create record
        $record = Record::create([
            'patient_id' => $patient->id,
            'duration' => $request->duration,
            'price' => $totalPrice,
            'status' => $status,
        ]);

        // Attach products/services only for non-trial patients
        foreach ($request->product_ids as $productId) {
            $product = Product::findOrFail($productId);
            $record->products()->attach(
                $product->id,
                ['price' => $status === 'Trial' ? 0 : $product->price]
            );
        }

        if (!empty($request->service_ids)) {
            foreach ($request->service_ids as $serviceId) {
                $service = Service::findOrFail($serviceId);
                $record->services()->attach(
                    $service->id,
                    ['price' => $status === 'Trial' ? 0 : $service->service_price]
                );
            }
        }


        return redirect()->route('records.index')
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
        return Inertia::render('Records/Edit', [
            'record'   => $record->load(['products', 'services']),
            'patients' => Patient::all(['id', 'name', 'free_trials']),
            'products' => Product::all(['id', 'name', 'price', 'duration']),
            'services' => Service::all(['id', 'name', 'service_price']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Record $record)
    {
        $request->validate([
            'patient_id'    => 'required|exists:patients,id',
            'product_ids'   => 'required|array',
            'product_ids.*' => 'exists:products,id',
            'service_ids'   => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
            'duration'      => 'required|integer',
            'voucher'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $patient = Patient::findOrFail($request->patient_id);

        // Handle voucher update
        $voucherPath = $record->voucher_path;
        if ($request->hasFile('voucher')) {
            $voucherPath = $request->file('voucher')->store('vouchers', 'public');
        }

        // Update basic record
        $record->update([
            'patient_id'   => $patient->id,
            'duration'     => $request->duration,
            'voucher_path' => $voucherPath,
        ]);

        // Sync products and services with price
        $productsData = [];
        foreach ($request->product_ids as $pid) {
            $product = Product::findOrFail($pid);
            $productsData[$product->id] = ['price' => $product->price];
        }
        $record->products()->sync($productsData);

        $servicesData = [];
        if (!empty($request->service_ids)) {
            foreach ($request->service_ids as $sid) {
                $service = Service::findOrFail($sid);
                $servicesData[$service->id] = ['price' => $service->service_price];
            }
        }
        $record->services()->sync($servicesData);

        // Update total price if not VVIP/Trial
        $totalPrice = $record->products->sum('pivot.price') + $record->services->sum('pivot.price');
        if (!in_array(strtolower($patient->role), ['vvip']) && $patient->free_trials <= 0) {
            $record->update(['price' => $totalPrice, 'status' => 'Paid']);
        }

        return redirect()->route('records.index')
            ->with('message', 'Record updated successfully.');
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
