<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard');
    }

    public function getdashboarddata(Request $request)
    {
        // 🧮 1. Expenses grouped by date
        $expenses = Expense::selectRaw('DATE(created_at) as date, SUM(amount) as total_amount')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('total_amount', 'date');

        // 🧮 2. Income grouped by date
        $income = Record::selectRaw('DATE(created_at) as date, SUM(price) as total_amount')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('total_amount', 'date');

        // 📅 3. Merge into one array for daily summary
        $dates = collect($expenses->keys())
            ->merge($income->keys())
            ->unique()
            ->sort();

        $dailyData = $dates->map(function ($date) use ($expenses, $income) {
            return [
                'date' => $date,
                'expense' => $expenses[$date] ?? 0,
                'income' => $income[$date] ?? 0,
            ];
        })->values();

        // 💎 4. Product totals (not by date)
        $productData = Record::select(
            'product_id',
            DB::raw('SUM(price) as total_amount'),
            DB::raw('SUM(duration) as total_duration')
        )
            ->with('product:id,name')
            ->groupBy('product_id')
            ->get()
            ->map(function ($record, $index) {
                $colorVar = 'var(--color-' . Str::slug($record->product->name ?? 'unknown') . ')';
                return [
                    'product' => $record->product->name ?? 'Unknown',
                    'total_amount' => $record->total_amount,
                    'total_duration' => $record->total_duration,
                    'fill' => $colorVar,
                ];
            });

        return response()->json([
            'daily' => $dailyData,
            'products' => $productData,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
