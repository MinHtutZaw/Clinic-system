<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::orderBy('id', 'desc')->paginate(10);
        return Inertia::render('Products/index', compact('products'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $services = Service::all();
        return Inertia::render('Products/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name'    => 'required|string|max:255',
                'price'       => 'required|numeric',
                'duration'    => 'required|integer',
                'description'   => 'required|string',
               
            ]
        );
        Product::create($validated);

       

        return redirect()->route('products.index')
            ->with('message', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
       
        return Inertia::render('Products/edit', [
            'product' => $product,
           
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate(
            [
                'name'    => 'required|string|max:255',
                'price'       => 'required|numeric',
                'duration'    => 'required|integer',
                'description' => 'required|string',
            ]
        );
        $product->update($validated);

        

        return redirect()->route('products.index')
                         ->with('message', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('message', 'Data is deleted successfully.');
    }
}
