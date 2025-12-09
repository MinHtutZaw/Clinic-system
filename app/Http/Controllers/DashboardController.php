<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Product;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard');
    }

    public function getdashboarddata(Request $request)
    {
        // --- Daily Expenses ---
        $expenses = Expense::selectRaw('DATE(created_at) as date, SUM(amount) as total_amount')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('total_amount', 'date');

        // --- Daily Income (from record_products pivot with join to records) ---
        $income = DB::table('record_products')
            ->join('records', 'record_products.record_id', '=', 'records.id')
            ->selectRaw('DATE(records.created_at) as date, SUM(record_products.price) as total_amount')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->pluck('total_amount', 'date');

        // --- Merge all dates ---
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

        // --- Product Data ---
        // Product analysis from pivot
        $productStats = DB::table('record_products')
            ->join('products', 'record_products.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name as product',
                DB::raw('SUM(record_products.price) as total_amount'),
                DB::raw('COUNT(record_products.id) * products.duration as total_duration'),
                DB::raw('COUNT(record_products.id) as usage_count')
            )
            ->groupBy('products.id', 'products.name', 'products.duration')
            ->orderByDesc('usage_count')
            ->get();

        // Most used product (if exists)
        $mostUsedProduct = $productStats->first();

        // Convert for chart format
        $productsForChart = $productStats->map(function ($item) {
            return [
                'product' => $item->product,
                'total_amount' => (float) $item->total_amount,
                'total_duration' => (int) $item->total_duration,
            ];
        });

        // --- Total Profit ---
        $incomePrice = DB::table('record_products')->sum('price');
        $expensePrice = Expense::sum('amount');
        $profit = $incomePrice - $expensePrice;

        // --- Most Used Product ---
        $mostUsedProductId = DB::table('record_products')
            ->select('product_id', DB::raw('COUNT(*) as total'))
            ->groupBy('product_id')
            ->orderByDesc('total')
            ->value('product_id');

        $mostUsedProduct = Product::find($mostUsedProductId);

        return response()->json([
            'daily' => $dailyData,
            'products' => $productsForChart,
            'mostUsedProduct' => $mostUsedProduct,
            'profit' => $profit,
        ]);
    }
}
