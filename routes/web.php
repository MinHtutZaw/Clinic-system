<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RecordController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VisitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
    // return redirect()->route('login'); // redirect guests to login
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    //Dashboard
    Route::post('/getdashboarddata', [DashboardController::class, 'getdashboarddata'])->name('getdashboarddata');
    //patient

    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::get('/patients/create', [PatientController::class, 'create'])->name('patients.create');

    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');


    Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])->name('patients.edit');

    Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('patients.update');
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('patients.destroy');

    //Visit
    Route::get('patients/{patient}/visits', [VisitController::class, 'index'])
        ->name('patients.visits.index');

    Route::get('patients/{patient}/visits/create', [VisitController::class, 'create'])
        ->name('patients.visits.create');

    Route::post('patients/{patient}/visits', [VisitController::class, 'store'])
        ->name('patients.visits.store');


    //   Product
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');

    Route::post('/products', [ProductController::class, 'store'])->name('products.store');


    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');

    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');


    //record
    Route::get('/records', [RecordController::class, 'index'])->name('records.index');
    Route::get('/records/create', [RecordController::class, 'create'])->name('records.create');

    Route::post('/records', [RecordController::class, 'store'])->name('records.store');

    Route::delete('/records/{record}', [RecordController::class, 'destroy'])->name('records.destroy');

    //Income



    //   Expenses
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses.index');
    Route::get('/expenses/create', [ExpenseController::class, 'create'])->name('expenses.create');

    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expense.store');


    Route::get('/expenses/{expense}/edit', [ExpenseController::class, 'edit'])->name('expense.edit');

    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])->name('expense.update');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expense.destroy');

    Route::resource('income', IncomeController::class);

    Route::resource('services', ServiceController::class);
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
